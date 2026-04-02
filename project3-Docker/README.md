# Task Manager App 🚀

A production-ready Full Stack Task Manager application built with FastAPI and PostgreSQL,
containerized with Docker, and deployed to AWS ECS using a Jenkins CI/CD Pipeline.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python FastAPI |
| Frontend | HTML + CSS + Vanilla JS |
| Database | PostgreSQL (AWS RDS) |
| Containerization | Docker + Docker Compose |
| Cloud Registry | AWS ECR |
| Deployment | AWS ECS (Fargate) |
| CI/CD | Jenkins Pipeline |

---

## 📁 Project Structure
```
project3-Docker/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── docker-compose.yml
├── Jenkinsfile
└── .env
```

---

## ✅ Features

- User Registration & Login
- Create, Read, Update, Delete Tasks
- Task Status: Pending / In Progress / Done
- REST API with FastAPI
- PostgreSQL for data persistence
- Fully Dockerized
- Deployed on AWS ECS Fargate
- Automated CI/CD with Jenkins

---

## 🚀 Project Setup Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/bhavanapabbathi/jenkins-docker.git
cd jenkins-docker/project3-Docker
```

### Step 2: Configure Environment Variables
Create `.env` file in root directory:
```
DATABASE_URL=postgresql://taskuser:taskpass@<RDS-ENDPOINT>:5432/taskdb
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=taskpass
POSTGRES_DB=taskdb
```

### Step 3: Build and Run with Docker Compose
```bash
docker-compose up --build -d
```

### Step 4: Verify Containers are Running
```bash
docker ps
```

Expected:
```
docker-backend   Up   0.0.0.0:8000->8000/tcp
docker-db        Up   0.0.0.0:5432->5432/tcp
```

### Step 5: Access the App
```
http://localhost:8000
```

---

## ☁️ AWS Infrastructure Setup

### Step 1: Create AWS ECR Repository
```bash
aws ecr create-repository --repository-name docker --region us-east-1
```

### Step 2: Build and Push Docker Image to ECR
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login \
--username AWS \
--password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t docker:latest ./backend

# Tag image
docker tag docker:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/docker:latest

# Push image
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/docker:latest
```

### Step 3: Create AWS RDS PostgreSQL
- Engine: PostgreSQL 15
- Instance: db.t3.micro (Free tier)
- Database name: taskdb
- Username: taskuser
- Password: taskpass

### Step 4: Create ECS Cluster
- Cluster name: docker
- Infrastructure: AWS Fargate

### Step 5: Create ECS Task Definition
- Family: dockertask
- CPU: 0.5 vCPU
- Memory: 1 GB
- Container: docker-backend
- Port: 8000
- Environment variable:
```
DATABASE_URL=postgresql://taskuser:taskpass@<RDS-ENDPOINT>:5432/taskdb
```

### Step 6: Create ECS Service
- Service name: docker-service
- Launch type: Fargate
- Desired tasks: 1
- Public IP: Enabled

---

## 🔧 Jenkins CI/CD Pipeline

### Pipeline Stages

| Stage | Description |
|---|---|
| Build Docker Image | Builds Docker image from Dockerfile |
| Push to ECR | Pushes image to AWS ECR |
| Deploy to ECS | Forces new ECS deployment |

### Jenkins Setup Steps

#### Step 1: Install Jenkins Plugins
- Docker
- Docker Pipeline
- Amazon ECR
- AWS Credentials
- Pipeline AWS Steps

#### Step 2: Add AWS Credentials in Jenkins
- Go to: Manage Jenkins → Credentials → Global
- Kind: AWS Credentials
- ID: aws-credentials

#### Step 3: Create Pipeline Job
- New Item → Pipeline
- Paste Jenkinsfile content
- Save and Build

### Jenkinsfile
```groovy
pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = 'docker'
        IMAGE_TAG = 'latest'
        ECS_CLUSTER = 'docker'
        ECS_SERVICE = 'docker-service'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                    cd /home/ec2-user/docker
                    sudo docker build -t $ECR_REPO:$IMAGE_TAG ./backend
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION | \
                        sudo docker login --username AWS --password-stdin $ECR_REGISTRY
                        sudo docker tag $ECR_REPO:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                        sudo docker push $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh '''
                        aws ecs update-service \
                            --cluster $ECS_CLUSTER \
                            --service $ECS_SERVICE \
                            --force-new-deployment \
                            --region $AWS_REGION
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
```

---

## 🔁 CI/CD Flow
```
Code Change → Jenkins Build →
Docker Image → Push to ECR →
Deploy to ECS → App Live!
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /users/ | Register new user |
| GET | /users/ | Get all users |
| POST | /tasks/ | Create new task |
| GET | /tasks/ | Get all tasks |
| PUT | /tasks/{id} | Update task |
| DELETE | /tasks/{id} | Delete task |
| GET | /health | Health check |

---

## 📸 Architecture
```
User → ECS Fargate → FastAPI Backend → RDS PostgreSQL
              ↑
         ECR (Docker Image)
              ↑
         Jenkins CI/CD
```

---

## 👩‍💻 Author
Bhavana Pabbathi
