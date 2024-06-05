# Journey Microservices

A project inspired by a practical class from a software development course, where we learned the importance of scalability, modularity, and resilience in system architecture.
The main goal of this project is to transform a legacy monolithic system into a modern and efficient microservices architecture.

# Comandos  
Create a Docker network : 
``` 
docker network create network-journey;
```

To create a kafka topic :
```
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic customers;

kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic products;

kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic rental;
```

# Links

<h4>
    <a href="https://github.com/codeedu/jornada-microservicos">🔗 Repository inspired by the practical class of the course</a>
</h4>

<h4>
    <a href="https://github.com/JozPedro23zx/Monolitc_System_DDD">🔗 Monolithic system that served as the foundation</a>
</h4>
