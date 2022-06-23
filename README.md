# graphql-helix-with-prisma-with-litestream-on-cloudrun-sample

## local

.env

```
DATABASE_URL="file:../local.db"
```

```
docker-compodse up
```

## deploy

```
gcloud beta run deploy hogeservicename --source . --execution-environment gen2 --max-instances 1 --set-env-vars DATABASE_URL="file:/prod.db",REPLICA_URL="gcs://hogebucketname/prod"
```

## query sample

```
{
  statuses {
    id
    body
    createdAt
  }
}
```

```
mutation test {
  createStatus(body:"test"){
    id
    body
    createdAt
  }
}
```

```
for i in {1..10} ; do curl -w "code: %{http_code}, speed: %{time_total}\n" -o /dev/null -s -X POST -d "{\"query\":\"{statuses{id body createdAt}}\"}" https://example.com/graphql ; done
```
