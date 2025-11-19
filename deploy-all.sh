#!/bin/bash
set -e

echo "🚀 Desplegando backend con Serverless..."
cd backend
sls deploy

echo "🔗 Obteniendo URL de API Gateway..."
URL=$(sls info | grep 'GET -' | head -n1 | awk '{print $3}' | sed 's/\/orders//')

echo "🌍 URL detectada: $URL"

echo "📝 Actualizando frontend/.env con la nueva URL..."
echo "VITE_API_BASE=$URL" > ../frontend/.env

cd ../frontend
echo "📦 Instalando dependencias del frontend..."
npm install

echo "💻 Levantando frontend en modo desarrollo..."
npm run dev
