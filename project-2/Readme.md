# Full CI/CD Pipeline using Jenkins, Docker & AWS EC2 🚀

## 📌 Project Overview
This project demonstrates a fully automated CI/CD pipeline where any 
code change pushed to GitHub automatically triggers Jenkins to build 
a Docker image, push it to DockerHub and deploy it as a container on 
AWS EC2 — without any manual intervention.

## 🏗️ Architecture
```
Developer pushes code to GitHub
            ↓
Jenkins detects change & pulls code
            ↓
Docker builds image from Dockerfile
            ↓
Image pushed to DockerHub registry
            ↓
Jenkins pulls image & runs container
            ↓
App is Live on AWS EC2 🚀
```

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| **AWS EC2** | Cloud server to host Jenkins and run containers |
| **Jenkins** | CI/CD automation server to run the pipeline |
| **Docker** | Containerize the application |
| **DockerHub** | Remote registry to store Docker images |
| **Nginx** | Web server running inside the container |
| **GitHub** | Source code repository |

## 📋 Pipeline Stages

### Stage 1 — Code 📥
- Jenkins pulls the latest code from GitHub repository
- Triggered manually or via GitHub Webhook

### Stage 2 — Build 🔨
- Jenkins runs `docker build` command
- Creates a Docker image using the Dockerfile
- Image is tagged with DockerHub repository name

### Stage 3 — Push 📦
- Jenkins securely logs into DockerHub using stored credentials
- Pushes the newly built image to DockerHub registry
- Image is now available publicly on DockerHub

### Stage 4 — Deploy 🚀
- Jenkins stops and removes any existing container
- Pulls the latest image from DockerHub
- Runs a new container on port 8081
- App is live and accessible via browser

## 🔐 Security
- DockerHub credentials are stored securely in Jenkins
- Credentials are never hardcoded in the pipeline script
- Jenkins credential binding injects secrets at runtime

## ⚙️ Jenkins Pipeline Script
```groovy
pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = "bhavanapabbathi/cicd-nginx-app"
    }
    stages {
        stage('Code') {
            steps {
                git url: 'https://github.com/bhavanapabbathi/jenkins-docker.git',
                branch: 'main'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t ${IMAGE_NAME} ./project2'
            }
        }
        stage('Push to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push ${IMAGE_NAME}'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stop cicd-app-container || true'
                sh 'docker rm cicd-app-container || true'
                sh 'docker pull ${IMAGE_NAME}'
                sh 'docker run -d -p 8081:80 --name cicd-app-container ${IMAGE_NAME}'
            }
        }
    }
}
```

## 🚀 How to Run This Project

### Prerequisites
- AWS EC2 instance (Amazon Linux)
- Jenkins installed and running on port 8080
- Docker installed on EC2
- DockerHub account

### Steps
1. Clone this repository
2. Launch EC2 and install Jenkins + Docker
3. Give Docker permission to Jenkins:
```bash
   sudo chmod 777 /var/run/docker.sock
   sudo usermod -aG docker jenkins
```
4. Add DockerHub credentials in Jenkins
5. Create Jenkins pipeline and paste the script
6. Click **Build Now**
7. Access app at `http://<ec2-public-ip>:8081`

## ✅ Output
A fully automated pipeline that builds, pushes and deploys 
a Dockerized Nginx web application on AWS EC2.

## 📸 Pipeline Stages View
```
Code ✅ → Build ✅ → Push to DockerHub ✅ → Deploy ✅
```
