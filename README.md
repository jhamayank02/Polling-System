
# Polling system

## Backend Developer Assignment - Polling System with Kafka, Zookeeper & Real-Time Features

### Objectives

Build a backend system that supports a high-concurrency polling feature using Kafka and
Zookeeper. The system should allow multiple users to interact with polls simultaneously,
ensure resiliency in case of failures, and include real-time poll updates using WebSockets
along with a leaderboard feature. The system must ensure no votes are lost, even in the
event of system failures.

## Frontend

Create a .env file by copying the contents from .env.example file

Run the frontend by using npm start command

## Kafka

1. docker run -p 2181:2181 zookeeper
2. docker run -p 9092:9092 ` --env KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 --env KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 --env KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 ` confluentinc/cp-kafka

## Backend

create a .env file by copying the contents from .env.example file and provide your <PRIVATE_IP> address in .env file.

Run npx nodemon command to start the server

