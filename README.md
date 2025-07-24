# MiniBill
Java side project
```bash
docker run --rm -d --name oracle-xe   -e ORACLE_PASSWORD=1234  -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql  -p 1521:1521   gvenzl/oracle-xe
```