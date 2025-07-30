#!/bin/bash

# Create SSL directory
mkdir -p ssl

# Generate self-signed SSL certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=VN/ST=Vietnam/L=Ho Chi Minh/O=AoDaiMaySan/CN=206.189.148.163"

echo "SSL certificates generated successfully!"
echo "Files created:"
echo "- ssl/key.pem (private key)"
echo "- ssl/cert.pem (certificate)"

echo ""
echo "Note: These are self-signed certificates for development/testing."
echo "For production, you should use certificates from a trusted CA like Let's Encrypt."
