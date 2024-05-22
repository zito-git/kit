## **Api Routes**

Method가 post일 경우 json형식으로 요청

```
{
  "userid":"test",
  "userpw":"password123@"
}
```

| Method | Url           | req                                    |
| ------ | ------------- | -------------------------------------- |
| post   | /api/useid    | userid=?                               |
| post   | /api/register | userid=?, userpw=?, nickname=?, role=? |
| post   | /api/login    | userid=?, userpw=?                     |
