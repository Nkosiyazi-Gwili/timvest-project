import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock database
let users = [
  {
    id: 1,
    email: 'admin@timvest.co.za',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    name: 'System Administrator'
  }
];

let clients = [];
let applications = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.post('/api/applications', async (req, res) => {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    companyType,
    services,
    paymentPlan
  } = req.body;

  const application = {
    id: applications.length + 1,
    companyName,
    contactPerson,
    email,
    phone,
    companyType,
    services,
    paymentPlan,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  applications.push(application);

  // Send confirmation email (mock)
  console.log(`Application received from ${companyName}`);

  res.status(201).json({
    message: 'Application submitted successfully',
    applicationId: application.id
  });
});

app.get('/api/admin/applications', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(applications);
});

app.put('/api/admin/applications/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { status } = req.body;

  const application = applications.find(app => app.id === parseInt(id));
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  application.status = status;
  application.updatedAt = new Date().toISOString();

  res.json({ message: 'Application updated successfully', application });
});

app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  res.json(stats);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Admin login: admin@timvest.co.za / password`);
});