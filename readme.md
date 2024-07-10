------ Heroku 사용

1. heroku install 컴퓨터에 하기!
2. heroku login 엡안에서 하기!
3. heroku create
4. payment 세팅해주고
5. 그다음 헤로쿠 들어가서 env 설정 해주면됨!
6. heroku apps:rename kwhouse <= api 이름바꾸기
7. heroku open
8. 만약 push거절당하면 package-lock 지우고 다시 npm install 뒤 git push heroku main 하면됨!

--------- postman publish ----------
는 view documentation 누른뒤에 publish 가있음....

log check
heroki login 하고
heroku logs -n 1500 입력하면 로그 확인가능!

and + or
// $and:[
  //     {$or:[
// {"first_name" : "john"},
// {"last_name" : "john"}
// ]},
// {"phone": "12345678"}
// ]});
