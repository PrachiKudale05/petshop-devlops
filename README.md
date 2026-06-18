#  Pet Shop – AWS Serverless DevOps Project

##  Project Overview

Pet Shop is a fully serverless cloud-native e-commerce application built on AWS that allows customers to browse pets and pet products, place orders online, receive AI-powered voice confirmations, and store order details securely in the cloud.

The project demonstrates real-world DevOps practices including CI/CD automation, serverless computing, cloud monitoring, API integration, and managed database services.

---

##  Key Highlights

✅ Serverless Architecture

✅ Automated CI/CD Pipeline

✅ REST API Integration

✅ Voice-Based Order Confirmation using Amazon Polly

✅ Cloud Monitoring with CloudWatch

✅ No Server Management Required

✅ Highly Scalable AWS Infrastructure

---

##  Architecture

GitHub
↓
CodePipeline
↓
CodeBuild
↓
Amazon S3 (Static Website Hosting)
↓
Customer Browser
↓
Amazon API Gateway
↓
AWS Lambda
├── Amazon DynamoDB (Order Storage)
└── Amazon Polly (Voice Generation)
↓
Amazon S3 Audio Storage
↓
Customer Hears Voice Confirmation

CloudWatch monitors all Lambda executions and application logs.

---

##  Business Problem Solved

Traditional pet stores often rely on manual order processing and lack automated customer communication.

This project provides:

* Automated order processing
* Real-time API communication
* Voice-enabled customer confirmations
* Centralized cloud-based data storage
* Automated deployment workflow

---

##  AWS Services Used

| Service            | Purpose                                |
| ------------------ | -------------------------------------- |
| Amazon S3          | Static Website Hosting & Audio Storage |
| AWS Lambda         | Serverless Backend Processing          |
| Amazon API Gateway | REST API Endpoints                     |
| Amazon DynamoDB    | NoSQL Database                         |
| Amazon Polly       | Text-to-Speech Voice Confirmation      |
| Amazon CloudWatch  | Monitoring & Logging                   |
| AWS CodePipeline   | Continuous Integration & Deployment    |
| AWS CodeBuild      | Automated Build Process                |
| GitHub             | Source Code Management                 |

---

##  Application Workflow

1. Customer selects pets/products.
2. Customer adds items to cart.
3. Customer submits order.
4. API Gateway receives request.
5. Lambda validates and processes order.
6. Order stored in DynamoDB.
7. Polly generates voice confirmation.
8. Audio file saved in S3.
9. Customer hears confirmation message.
10. CloudWatch logs all activities.
11. CodePipeline automatically deploys updates from GitHub.

---

##  DevOps Practices Implemented

* Infrastructure on AWS Cloud
* Source Control with GitHub
* Continuous Integration (CI)
* Continuous Deployment (CD)
* Automated Build Process
* Monitoring & Observability
* Serverless Computing
* Event-Driven Architecture

---

##  Project Impact

* Reduced infrastructure management by 100% using serverless services.
* Automated deployment pipeline eliminating manual deployments.
* Real-time order processing through REST APIs.
* Enhanced customer experience with voice confirmations.
* Highly scalable architecture capable of handling increased traffic automatically.

---

##  Author

Prachi Santosh Kudale

AWS | Python | DevOps Enthusiast

---
