# Anythink Market Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Docker** (20.10+) and Docker Compose (2.0+)
- **Node.js** (16+ LTS) - for local development
- **Git** - for version control
- **kubectl** (optional) - for Kubernetes deployment
- **AWS CLI** (optional) - for AWS deployment

### System Requirements

- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 10GB free space
- **OS:** Linux, macOS, or Windows with WSL2

---

## Local Development

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wilcolab/Anythink-Market-fnscfx3q.git
   cd Anythink-Market-fnscfx3q
   ```

2. **Start all services**
   ```bash
   docker compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

4. **Stop services**
   ```bash
   docker compose down
   ```

### Development Mode Features

- **Hot Reload:** Code changes automatically refresh
- **Volume Mounts:** Local code synced with containers
- **Live Logs:** Real-time container output

### Running Individual Services

**Backend only:**
```bash
docker compose up anythink-backend-node mongodb-node
```

**Frontend only** (requires backend running):
```bash
docker compose up anythink-frontend-react
```

---

## Docker Deployment

### Building Images

**Backend:**
```bash
cd backend
docker build -t anythink-backend:latest .
```

**Frontend:**
```bash
cd frontend
docker build -t anythink-frontend:latest .
```

### Docker Compose Configuration

The `docker-compose.yml` includes:
- Service definitions
- Network configuration
- Volume mappings
- Environment variables
- Health checks

### Production Configuration

For production, modify `docker-compose.yml`:

```yaml
services:
  anythink-backend-node:
    build:
      context: ./backend
      dockerfile: Dockerfile.aws  # Production Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=${MONGODB_URI}
      - SECRET=${JWT_SECRET}
    restart: unless-stopped
```

### Docker Best Practices

1. **Use Multi-Stage Builds**
   - Separate build and runtime dependencies
   - Reduce image size

2. **Environment Variables**
   - Never commit secrets
   - Use `.env` files (git-ignored)
   - Consider Docker secrets

3. **Health Checks**
   - Implement health endpoints
   - Configure container health checks

4. **Logging**
   - Use stdout/stderr for logs
   - Configure log drivers

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.19+)
- kubectl configured
- Helm (optional, for package management)

### Deployment Files

Charts are located in `/charts`:
```
charts/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── anythink-backend-deployment.yaml
    ├── anythink-backend-service.yaml
    ├── anythink-frontend-deployment.yaml
    ├── anythink-frontend-service.yaml
    ├── database-deployment.yaml
    ├── database-pvc.yaml
    └── database-service.yaml
```

### Deploy with kubectl

1. **Create namespace**
   ```bash
   kubectl create namespace anythink-market
   ```

2. **Apply configurations**
   ```bash
   kubectl apply -f charts/templates/ -n anythink-market
   ```

3. **Check deployment status**
   ```bash
   kubectl get pods -n anythink-market
   kubectl get services -n anythink-market
   ```

### Deploy with Helm

1. **Install Helm chart**
   ```bash
   helm install anythink-market ./charts -n anythink-market --create-namespace
   ```

2. **Upgrade deployment**
   ```bash
   helm upgrade anythink-market ./charts -n anythink-market
   ```

3. **Uninstall**
   ```bash
   helm uninstall anythink-market -n anythink-market
   ```

### Configuration

Edit `charts/values.yaml`:

```yaml
backend:
  image: your-registry/anythink-backend:latest
  replicas: 3
  port: 3000
  env:
    NODE_ENV: production
    MONGODB_URI: mongodb://mongodb-service:27017/anythink-market

frontend:
  image: your-registry/anythink-frontend:latest
  replicas: 3
  port: 3001

database:
  storageSize: 10Gi
  storageClass: standard
```

### Scaling

```bash
# Scale backend
kubectl scale deployment anythink-backend -n anythink-market --replicas=5

# Scale frontend
kubectl scale deployment anythink-frontend -n anythink-market --replicas=5
```

### Ingress Configuration

Create an Ingress resource:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: anythink-ingress
  namespace: anythink-market
spec:
  rules:
  - host: anythink.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: anythink-backend-service
            port:
              number: 3000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: anythink-frontend-service
            port:
              number: 3001
```

---

## AWS Deployment

### Option 1: ECS (Elastic Container Service)

1. **Build and push images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build with AWS Dockerfile
   docker build -f backend/Dockerfile.aws -t anythink-backend:latest backend/
   docker build -f frontend/Dockerfile.aws -t anythink-frontend:latest frontend/

   # Tag and push
   docker tag anythink-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/anythink-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/anythink-backend:latest
   ```

2. **Create ECS Task Definitions**
   - Define container configurations
   - Set environment variables
   - Configure networking

3. **Create ECS Service**
   - Application Load Balancer
   - Auto-scaling policies
   - Health checks

### Option 2: EKS (Elastic Kubernetes Service)

1. **Create EKS cluster**
   ```bash
   eksctl create cluster --name anythink-market --region us-east-1
   ```

2. **Deploy using kubectl**
   ```bash
   kubectl apply -f charts/templates/
   ```

3. **Configure ALB Ingress Controller**

### Option 3: Elastic Beanstalk

1. **Initialize EB**
   ```bash
   eb init -p docker anythink-market
   ```

2. **Create environment**
   ```bash
   eb create anythink-prod
   ```

3. **Deploy**
   ```bash
   eb deploy
   ```

### AWS Services Configuration

**Database Options:**
- **DocumentDB** - MongoDB-compatible managed service
- **EC2 with MongoDB** - Self-managed
- **MongoDB Atlas** - Cloud-hosted

**Load Balancing:**
- Application Load Balancer (ALB)
- Route health checks to `/api/ping`

**Security:**
- VPC configuration
- Security groups (ports 3000, 3001, 27017)
- IAM roles for services
- Secrets Manager for credentials

---

## Environment Configuration

### Backend Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/anythink-market

# Authentication
SECRET=your-jwt-secret-key-here

# GitHub Codespaces (if applicable)
GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=
```

### Frontend Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001

# Backend URL
REACT_APP_BACKEND_URL=http://localhost:3000

# WebSocket (for hot reload)
WDS_SOCKET_PORT=3001

# Codespaces
CODESPACE_BACKEND_URL=
CODESPACE_WDS_SOCKET_PORT=
```

### Creating .env Files

**Backend (.env):**
```bash
cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongodb-node:27017/anythink-market
SECRET=$(openssl rand -base64 32)
EOF
```

**Frontend (.env):**
```bash
cat > frontend/.env << EOF
REACT_APP_BACKEND_URL=http://localhost:3000
EOF
```

---

## Database Setup

### Initial Setup

MongoDB is automatically initialized by Docker Compose with no authentication required for development.

### Seeding Data

```bash
# Enter backend container
docker exec -it anythink-backend-node sh

# Run seed script
npm run seed
```

Or run directly:
```bash
docker exec anythink-backend-node npm run seed
```

### Backup and Restore

**Backup:**
```bash
docker exec mongodb-node mongodump --db anythink-market --out /backup
docker cp mongodb-node:/backup ./backup
```

**Restore:**
```bash
docker cp ./backup mongodb-node:/backup
docker exec mongodb-node mongorestore --db anythink-market /backup/anythink-market
```

### Production Database

For production, consider:

1. **Authentication**
   ```javascript
   MONGODB_URI=mongodb://username:password@host:27017/anythink-market?authSource=admin
   ```

2. **Replica Set**
   ```javascript
   MONGODB_URI=mongodb://host1,host2,host3/anythink-market?replicaSet=rs0
   ```

3. **SSL/TLS**
   ```javascript
   MONGODB_URI=mongodb://host:27017/anythink-market?ssl=true
   ```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

#### Container Won't Start
```bash
# Check logs
docker compose logs anythink-backend-node
docker compose logs anythink-frontend-react

# Rebuild containers
docker compose up --build
```

#### Database Connection Failed
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Test connection
docker exec -it mongodb-node mongosh
```

#### Frontend Can't Connect to Backend
- Check `REACT_APP_BACKEND_URL` is correct
- Verify backend is running: `curl http://localhost:3000/api/ping`
- Check CORS configuration

#### Volume Permission Issues (Linux)
```bash
# Fix ownership
sudo chown -R $USER:$USER .
```

### Health Checks

**Backend:**
```bash
curl http://localhost:3000/api/ping
```

**Frontend:**
```bash
curl http://localhost:3001
```

**MongoDB:**
```bash
docker exec mongodb-node mongosh --eval "db.adminCommand('ping')"
```

### Logs

**View all logs:**
```bash
docker compose logs -f
```

**View specific service:**
```bash
docker compose logs -f anythink-backend-node
```

**Export logs:**
```bash
docker compose logs > application.log
```

### Performance Monitoring

```bash
# Container stats
docker stats

# Resource usage
docker compose top
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build images
        run: |
          docker build -f backend/Dockerfile.aws -t backend:${{ github.sha }} backend/
          docker build -f frontend/Dockerfile.aws -t frontend:${{ github.sha }} frontend/
      
      - name: Push to registry
        run: |
          # Push to your container registry
      
      - name: Deploy
        run: |
          # Deploy to your infrastructure
```

---

## Security Checklist

- [ ] Change default JWT secret
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Environment variable protection
- [ ] Rate limiting on API
- [ ] Input validation
- [ ] CORS configuration
- [ ] Security headers (Helmet.js)

---

## Maintenance

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose down
docker compose up --build -d
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove volumes (WARNING: deletes data)
docker compose down -v

# Full cleanup
docker system prune -a --volumes
```

---

## Support

For issues and questions:
- Check existing GitHub issues
- Review logs and error messages
- Consult API documentation
- Contact: @vanessa-cooper
