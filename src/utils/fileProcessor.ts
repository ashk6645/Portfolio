import * as XLSX from 'xlsx';
import { createWorker } from 'tesseract.js';
import { addInvoice, setLoading, setError } from '../store/slices/invoicesSlice';
import { addProduct } from '../store/slices/productsSlice';
import { addCustomer } from '../store/slices/customersSlice';
import { Invoice, Product, Customer } from '../types';

export const processFile = async (file: File, dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  const fileType = file.type;

  try {
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      await processExcel(file, dispatch);
    } else if (fileType.includes('pdf')) {
      await processPDF(file, dispatch);
    } else if (fileType.includes('image')) {
      await processImage(file, dispatch);
    } else {
      throw new Error('Unsupported file format');
    }
    dispatch(setLoading(false));
  } catch (error) {
    console.error('Error processing file:', error);
    dispatch(setError((error as Error).message));
    dispatch(setLoading(false));
    throw error;
  }
};

const extractInvoiceData = (data: any): { invoice: Invoice; product: Product; customer: Customer } => {
  const id = crypto.randomUUID();
  const date = data.date || new Date().toISOString();
  const quantity = Number(data.quantity) || 0;
  const unitPrice = Number(data.unitPrice) || 0;
  const tax = Number(data.tax) || 0;
  const totalAmount = Number(data.totalAmount) || (quantity * unitPrice * (1 + tax / 100));

  return {
    invoice: {
      id,
      serialNumber: data.serialNumber || `INV-${Date.now()}`,
      customerName: data.customerName || '',
      productName: data.productName || '',
      quantity,
      tax,
      totalAmount,
      date,
    },
    product: {
      id,
      name: data.productName || '',
      quantity,
      unitPrice,
      tax,
      priceWithTax: totalAmount,
      discount: Number(data.discount) || 0,
    },
    customer: {
      id,
      name: data.customerName || '',
      phoneNumber: data.phoneNumber || '',
      totalPurchaseAmount: totalAmount,
      email: data.email || '',
      address: data.address || '',
    },
  };
};

const processExcel = async (file: File, dispatch: any) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error('No data found in Excel file');
  }

  jsonData.forEach((row: any) => {
    const { invoice, product, customer } = extractInvoiceData(row);
    dispatch(addInvoice(invoice));
    dispatch(addProduct(product));
    dispatch(addCustomer(customer));
  });
};

const processPDF = async (file: File, dispatch: any) => {
  // For PDF processing, we would typically use a PDF parsing library
  // Since we're in a browser environment, we'll use a basic approach
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        // Here we would normally parse the PDF content
        // For now, we'll create a basic entry with the file name
        const fileName = file.name.replace('.pdf', '');
        const { invoice, product, customer } = extractInvoiceData({
          serialNumber: `PDF-${Date.now()}`,
          customerName: fileName,
          productName: 'PDF Import',
          quantity: 1,
          tax: 10,
          totalAmount: 100,
        });
        
        dispatch(addInvoice(invoice));
        dispatch(addProduct(product));
        dispatch(addCustomer(customer));
        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

const processImage = async (file: File, dispatch: any) => {
  const worker = await createWorker();
  const imageUrl = URL.createObjectURL(file);
  
  try {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(imageUrl);
    
    // Extract potential invoice data from the OCR text
    const extractedData = {
      serialNumber: `IMG-${Date.now()}`,
      customerName: extractCustomerName(text),
      productName: extractProductName(text),
      quantity: extractNumber(text, /quantity:\s*(\d+)/i),
      tax: extractNumber(text, /tax:\s*(\d+)/i),
      totalAmount: extractNumber(text, /total:\s*(\d+\.?\d*)/i),
    };
    
    const { invoice, product, customer } = extractInvoiceData(extractedData);
    dispatch(addInvoice(invoice));
    dispatch(addProduct(product));
    dispatch(addCustomer(customer));
  } finally {
    await worker.terminate();
    URL.revokeObjectURL(imageUrl);
  }
};

// Helper functions for OCR text extraction
const extractCustomerName = (text: string): string => {
  const match = text.match(/customer:\s*([^\n]+)/i);
  return match ? match[1].trim() : '';
};

const extractProductName = (text: string): string => {
  const match = text.match(/product:\s*([^\n]+)/i);
  return match ? match[1].trim() : '';
};

const extractNumber = (text: string, regex: RegExp): number => {
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : 0;
};