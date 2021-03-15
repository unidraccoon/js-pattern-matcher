# JavaScript Pattern Matcher

## Описание синтаксиса патча

Патч делится на две части разделенные `---`

* Первая часть описывает ту часть кода, которую мы собираемся искать

* Вторая часть отвечает за то, что мы хотим получить из найденной части кода

### Первая часть патча

Первая часть патча представляет собой модифицированный JavaScript который описывает уловие для поиска кода:

1. Специальные обозначения:

* `/**/` — применяется к идентификаторам, означает что идентификатор становится метапеременной
*Пример:* `identifireName/**/`).
* `/*%name%*/`  — обозначение для именования части кода (поддерева в AST), далее по данному имени можно получать доступ к свойствам поддерева.

*Пример:*

```javascript
/*exprs*/document.write(location.href)
---
return expers.loc
```  

2. Код не обязательно должен быть валидным, а именно:

```javascript
// Интерпретируется как объектный литерал
{
 url: 'example.com', 
}
```

3. Ищутся совпадения:

* На синтаксическом уровне (уровне AST) , то есть в частности совпадение до различий в интервалах, отступах и комментариях
* До выбора имен переменных (метапеременные)
* /Список будет дополняться по мере реализации/

### Вторая часть патча

Вторая часть патча состоит из чистого языка JavaScript.
В ней происходит оперирование сущностями (метапеременные, именованные поддеревья), извлеченными из первой части части.
Выражение вычисляется для каждого найденного поддерева и от второй части зависит вывод программы.

## Примеры

1. Аргументы депов (Клиентский код)

```javascript
{
    url: url/**/,
    method: method/**/,
}
---
if (!(url.type == "StringLiteral" && method.type == "StringLiteral")) {
    return;
}
return {url: url.value, method: method.value}
```

*Ввод:*

```javascript
$.ajax({
    "method": "GET",
    url: "http://example.com",
})
```

*Вывод:*

```javascript
{
    "url": "http://example.com"
    "method": "GET"
}
```

2. Поиск routes (Серверный код)

```javascript
/*exprs*/router/**/.method/**/(path/**/, function () {
    /*...*/
})
---
if (!(method.type == "Identifier" && path.type == "StringLiteral")) {
    return;
}
const {name} = method, {value} = path;
const methods = ["get", "post", "put", "delete", "patch"]
if (methods.includes(name)) {
    const {loc} = exprs;
    return {value, loc};
}
```

*Ввод:*

```javascript
router.get('/events', function (req, res, next) {
    // ...
})
```

*Вывод:*

```javascript
{
    "value": "/events"
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 3,
            "column": 2
        }
    },
}
```

3. Поиск запросов к базе данных (Серверный код)

```javascript
/*exprs*/connection/**/.query(dbquery/**/, function () {
    /*...*/
})
---
if (!(dbquery.type == "StringLiteral")) {
    return;
}
const {value} = dbquery;
if (methods.includes(name)) {
    const {loc} = exprs;
    return {value, loc};
}
```

*Ввод:*

```javascript
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
})
```

*Вывод:*

```javascript
{
    "value": "SELECT 1 + 1 AS solution"
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 4,
            "column": 2
        }
    },
}
```

4. Поиск sink’ов для DOM-based XSS

```javascript
/*exprs*/document.write(location/**/.href)
---
const {loc} = exprs;
return {loc};
```

*Ввод:*

```javascript
document.write(location.href)
```

*Вывод:*

```javascript
{
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 29
        }
    },
}
```
