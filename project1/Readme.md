# Jenkins + Docker CI/CD Pipeline 🚀

A hands-on DevOps project that demonstrates a basic CI/CD pipeline 
using Jenkins and Docker on AWS EC2.

## 🏗️ Architecture

GitHub (index.html + Dockerfile) → Jenkins Pipeline → Docker Container → Live App

## 🛠️ Tech Stack

- **AWS EC2** - Amazon Linux server
- **Jenkins** - CI/CD automation
- **Docker** - Containerization
- **Nginx** - Web server inside container
- **GitHub** - Source code management

## 📋 Pipeline Stages

1. **Code** - Jenkins pulls code from GitHub
2. **Build** - Docker builds image from Dockerfile
3. **Deploy** - Docker runs container on port 8081

## 🚀 How to Run

1. Launch EC2 instance and install Jenkins + Docker
2. Give Docker permissions to Jenkins:
```bash
   sudo chmod 777 /var/run/docker.sock
   sudo usermod -aG docker jenkins
```
3. Create Jenkins pipeline with the Jenkinsfile
4. Click **Build Now** and access app at `http://<ec2-public-ip>:8081`

## ✅ Output

A simple nginx web app deployed automatically via Jenkins pipeline.
