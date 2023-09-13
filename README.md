# Journey Microservices

Um projeto inspirada por uma aula prática de um curso de desenvolvimento de software, onde aprendemos a importância da escalabilidade, modularidade e resiliência na arquitetura de sistemas.
O objetivo principal deste projeto é transformar um sistema monolítico legado em uma arquitetura de microserviços moderna e eficiente.

# Comandos  
Crie uma rede do docker com: 
``` 
docker network create network-journey;
```

Para criar o tópico do kafka:
```
kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic customers;
```

# Links

<h4>
    <a href="https://github.com/codeedu/jornada-microservicos">🔗 Repositório inspirado da aula prática do curso</a>
</h4>

<h4>
    <a href="https://github.com/JozPedro23zx/Monolitc_System_DDD">🔗 Sistema monolítico que serviu como base</a>
</h4>
