# JavaScript Pattern Matcher

## Установка

1. `git clone https://github.com/unidraccoon/js-pattern-matcher.git`
2. `cd js-pattern-matcher`
3. `npm install`
4. `tsc`

## Использование

`node src/main.js --patch "patch.txt" --file "test.js"`

```console
Usage: main.js --file [JavaScript file path] --patch [Patch file path]

Опции:
  --help     Показать помощь                                       [булевый тип]
  --version  Показать номер версии                                 [булевый тип]
  --patch                                           [строковой тип] [необходимо]
  --file                                            [строковой тип] [необходимо]
```

Инструмент получает на вход два файла:

* `patch` - путь до патча
* `file` - JavaScript файл в котором необзоим поиск

## Описание синтаксиса патча

Патч делится на две части разделенные `---`

* Первая часть описывает ту часть кода, которую мы собираемся искать

* Вторая часть отвечает за то, что мы хотим получить из найденной части кода

*Пример:*

```javascript
router.$$method($$path)
---
console.log($$method.name, $$path.value)
```  

### Первая часть патча

Первая часть патча представляет собой JavaScript который описывает уcловие для поиска кода:

* Метапеременные начинаются с `$$`
*Пример:* `$$identifireName`).

* Для отдельного поиска объектных литералов их необходимо обернуть в скобки:

```javascript
({
 url: 'example.com', 
})
```

* Если необходимо опустить код в блоке, нужно поставить комментарий в этом месте.

*Пример:*

```javascript
router.get($$path, function (req, res, next) {
    /*...*/
})
```

1. Ищутся совпадения:

* На синтаксическом уровне (уровне AST) , то есть в частности совпадение до различий в интервалах, отступах и комментариях
* До выбора имен переменных (метапеременные)
* /Список будет дополняться по мере реализации/

### Вторая часть патча

Вторая часть патча так же состоит из JavaScript-кода.
В ней происходит оперирование сущностями (метапеременными), извлеченными из первой части части.

Выражение вычисляется для каждого найденного поддерева и от второй части зависит вывод программы.

Для вывода необходимой информации необходимо использовать `console.log()`.

Для завершения выполнения используется команда `exit()`.

## Примеры

* Аргументы депов (Клиентский код)

```javascript
({
    url: $$url,
    method: $$method,
})
---
if (!($$url.type == "StringLiteral" && $$method.type == "StringLiteral")) {
    exit(1);
}
console.log({url: $$url.value, method: $$method.value})
```

*Ввод:*

```javascript
$.ajax({
    url: "http://example.com",
    method: "GET",
})
```

*Вывод:*

```javascript
{
    url: "http://example.com"
    method: "GET"
}
```

* Поиск routes (Серверный код)

```javascript
$$router.$$method($$path, function (req, res, next) {
    /*...*/
})
---
if (!($$method.type == "Identifier" && $$path.type == "StringLiteral")) {
    exit(1);
}
const {name} = $$method, {value} = $$path;
const methods = ["get", "post", "put", "delete", "patch"]
if (methods.includes(name)) {
    console.log(value);
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
/events
```

* Поиск запросов к базе данных (Серверный код)

```javascript
$$connection.query($$dbquery, function (err, rows, fields) {
    /*...*/
})
---
if (!($$dbquery.type == "StringLiteral")) {
    exit(1);
}
console.log($$dbquery.value);
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
SELECT 1 + 1 AS solution
```

* Поиск sink’ов для DOM-based XSS

```javascript
$$document.write($$location.href)
---
const {loc} = $$document;
console.log(loc);
```

*Ввод:*

```javascript
document.write(location.href)
```

*Вывод:*

```javascript
SourceLocation {
  start: Position { line: 1, column: 0 },
  end: Position { line: 1, column: 8 },
  filename: undefined,
  identifierName: 'document'
}
```
