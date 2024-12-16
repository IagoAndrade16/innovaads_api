Como criar uma nova table usando typeorm migration
```sh
    yarn typeorm migration:create src/database/migrations/CreateLogsTable
```

Para executar a migração em dev
```sh
    yarn typeorm-dev-run
```

Para desfazer a migration em dev
```sh
    yarn typeorm-dev-revert
```


# Apos criar a migracao 
1 - Criar um entities
2 - Criar o respositories
  2.1 - Precisar criar o arqivo dentro da pasta de respositories/implmentations 
  2.2 - Criar o teste respositories/testes 
3 - Agora vamos criar um usecases