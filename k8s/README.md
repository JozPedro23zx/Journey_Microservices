### Mysql
Crie uma senha para o mysql: 
```
kubectl create secret generic customer-mysql-pass --from-literal=password='a1s30b2'
```
Acesse a senha usando: 
```
kubectl get secret customer-mysql-pass -ojsonpath='{.data.password}' | base64 --decode
```

### Kafka
Adicione o kafka com os comandos: 
```
helm repo add confluentinc https://confluentinc.github.io/cp-helm-charts/
helm repo update
helm install confluentinc/cp-helm-charts --name my-confluent --version 0.6.0
```
