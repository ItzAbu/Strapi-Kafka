@echo off
SETLOCAL EnableDelayedExpansion

set CERTS_DIR=certs
set PASSWORD=password123
set KAFKA_CN=kafka
set HOST_CN=host.docker.internal
set LOCAL_CN=localhost

echo [1/7] Preparazione ambiente...
if exist "%CERTS_DIR%" rmdir /s /q "%CERTS_DIR%"
mkdir "%CERTS_DIR%"
cd "%CERTS_DIR%"

echo [2/7] Generazione Certificate Authority...
openssl req -new -x509 -keyout ca.key -out ca.crt -days 365 -subj "/CN=Kafka-Root-CA" -passout pass:!PASSWORD!

echo [3/7] Generazione certificato server...
(
echo [req]
echo distinguished_name = req_distinguished_name
echo req_extensions = v3_req
echo [req_distinguished_name]
echo [v3_req]
echo subjectAltName = @alt_names
echo [alt_names]
echo DNS.1 = !KAFKA_CN!
echo DNS.2 = !HOST_CN!
echo DNS.3 = !LOCAL_CN!
) > ssl.cnf

openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/CN=!KAFKA_CN!" -config ssl.cnf
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -extensions v3_req -extfile ssl.cnf -passin pass:!PASSWORD!

echo [4/7] Creazione keystore JKS...
openssl pkcs12 -export -in server.crt -inkey server.key -out server.p12 -name "kafka-server" -password pass:!PASSWORD!
keytool -importkeystore -srckeystore server.p12 -srcstoretype PKCS12 -destkeystore kafka.keystore.jks -deststoretype JKS -deststorepass !PASSWORD! -srcstorepass !PASSWORD! -noprompt

echo [5/7] Creazione truststore JKS...
keytool -keystore kafka.truststore.jks -alias CARoot -import -file ca.crt -storepass !PASSWORD! -noprompt

echo [6/7] Generazione certificato client AKHQ...
keytool -genkey -alias akhq-client -keyalg RSA -keystore client.keystore.jks -storepass !PASSWORD! -keypass !PASSWORD! -dname "CN=akhq-client" -validity 365
keytool -export -alias akhq-client -keystore client.keystore.jks -file client.crt -storepass !PASSWORD!
keytool -import -alias akhq-client -file client.crt -keystore kafka.truststore.jks -storepass !PASSWORD! -noprompt

echo [7/7] Pulizia e verifica...
del *.csr 2>nul
del *.p12 2>nul
del ssl.cnf 2>nul

echo.
echo === CERTIFICATI GENERATI CON SUCCESSO ===
echo File: 
dir /b
echo.
echo Per avviare: docker-compose up -d
echo =========================================
pause