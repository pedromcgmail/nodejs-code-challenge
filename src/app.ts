import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { Product } from './types';
import { User } from './types';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// this key should go in a .env file
const ACCESS_TOKEN_SECRET="TUI"


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

//****************************************************************** */
//                  Task 1: Fetch product list
//********************************************************************/  
interface ProductsApiResponse {
  products: Product[];
}

//--> GET call to fetch product list
app.get('/products', async (req: Request, res: Response) => {
  const products: Product[] = [];
  // put your code here
  try {
    const apiUrl = "https://dummyjson.com/products";
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch products- response not ok");
    }
    const responseData = (await response.json()) as ProductsApiResponse;

    responseData.products.forEach((element) => {
      const product: Product = {
        id: element.id,
        title: element.title,
        description: element.description,
        price: element.price,
        thumbnail: element.thumbnail,
      };
      products.push(product);
     });
    // Sort by title
    res.json(products.sort((a, b) => a.title.localeCompare(b.title)));

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error +++ ");
  }
});

//****************************************************************** */
//                  Task 2: Login
//********************************************************************/  
type UserResponse = {
  username: string;
  firstName: string;
  lastName: string;
  image: string;
  token: string;
}

//--> POST call to login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
 
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const url = 'https://dummyjson.com/auth/login';
  const requestBody = {
    username: username,
    password: password
  };

  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Invalid credentials' });
    }

    const userResponde = (await response.json())  as UserResponse
    
    const userData: User = {
      username: userResponde.username,
      firstName: userResponde.firstName,
      lastName: userResponde.lastName,
      avatar: userResponde.image,
      token: userResponde.token,
    }
    
    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to authenticate' });
  }
});

//****************************************************************** */
//                  Task 3: Cart
//********************************************************************/  
// Define types
type CartPayload = {
  productId: number;
};

type TokenPayload = {
  customerId: number; 
};

// Sample in-memory storage for carts
 const carts: Record<number, number[]> = {}; 
// Key: customerId, Value: Array of productIds

// Middleware to decode token and block unauthenticated requests
function AuthenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
          
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401).json({ error: 'Token is missing' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decodedToken: any) => {
      
      if (err) return res.sendStatus(403).json({ error: 'Invalid token' });
             
      (req as any).customerId = decodedToken?.customerId;
      next();
  })
};

//--> POST call to add product to cart
app.post("/cart", AuthenticateToken, (req: Request, res: Response) => {
  const customerId = (req as any).customerId as number;
  const payload: CartPayload = req.body;

  // Get customer's cart or create new if it doesn't exist
  const customerCart = carts[customerId] || [];

  // Check if product already exists in the cart
  if (customerCart.includes(payload.productId)) {
  return res.status(400).json({ message: 'Product already exists in the cart' });
  }

  // Add product to cart
  customerCart.push(payload.productId);
  carts[customerId] = customerCart;

  res.json({ message: 'Product added to cart successfully' });
});

//************************************************************************** */
export default app;
