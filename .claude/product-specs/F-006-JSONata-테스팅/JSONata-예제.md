# JSONata 예제

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**상위 문서**: [F-006: JSONata 테스팅](../F-006-JSONata-테스팅.md)

---

## 개요

이 문서는 JSONata 표현식의 실제 사용 예제와 패턴을 제공합니다. transform-data 블록에서 활용할 수 있는 다양한 데이터 변환 기법을 다룹니다.

---

## 예시 1: 필터링

### 기본 필터링

**입력 데이터**:

```json
[
  { "id": 1, "name": "Product A", "price": 100, "status": "active" },
  { "id": 2, "name": "Product B", "price": 200, "status": "inactive" },
  { "id": 3, "name": "Product C", "price": 150, "status": "active" }
]
```

**표현식**:

```jsonata
[status='active']
```

**결과**:

```json
[
  { "id": 1, "name": "Product A", "price": 100, "status": "active" },
  { "id": 3, "name": "Product C", "price": 150, "status": "active" }
]
```

### 숫자 범위 필터링

**표현식**:

```jsonata
[price >= 100 and price <= 150]
```

**결과**:

```json
[
  { "id": 1, "name": "Product A", "price": 100, "status": "active" },
  { "id": 3, "name": "Product C", "price": 150, "status": "active" }
]
```

---

## 예시 2: 필드 선택 및 변환

### 필드 이름 변경

**표현식**:

```jsonata
[status='active'].{
  "productId": id,
  "productName": name,
  "priceInDollars": price
}
```

**결과**:

```json
[
  { "productId": 1, "productName": "Product A", "priceInDollars": 100 },
  { "productId": 3, "productName": "Product C", "priceInDollars": 150 }
]
```

### 계산된 필드 추가

**표현식**:

```jsonata
*.{
  "id": id,
  "name": name,
  "price": price,
  "priceWithTax": price * 1.1
}
```

---

## 예시 3: 집계 함수

### 기본 집계

**표현식**:

```jsonata
{
  "totalProducts": $count(*),
  "activeProducts": $count([status='active']),
  "totalValue": $sum(*.price),
  "averagePrice": $average(*.price)
}
```

**결과**:

```json
{
  "totalProducts": 3,
  "activeProducts": 2,
  "totalValue": 450,
  "averagePrice": 150
}
```

### 최소/최대값

**표현식**:

```jsonata
{
  "minPrice": $min(*.price),
  "maxPrice": $max(*.price),
  "cheapestProduct": *[price = $min($$.*.price)].name,
  "expensiveProduct": *[price = $max($$.*.price)].name
}
```

---

## 예시 4: 중첩 데이터 처리

### 입력 데이터

```json
{
  "users": {
    "user1": {
      "spaces": [
        { "id": "space1", "name": "Space A" },
        { "id": "space2", "name": "Space B" }
      ]
    },
    "user2": {
      "spaces": [{ "id": "space3", "name": "Space C" }]
    }
  }
}
```

### 모든 Space ID 추출

**표현식**:

```jsonata
$distinct(users.*.spaces[].id)
```

**결과**:

```json
["space1", "space2", "space3"]
```

### Space 평탄화

**표현식**:

```jsonata
users.*.spaces[].{
  "spaceId": id,
  "spaceName": name
}
```

**결과**:

```json
[
  { "spaceId": "space1", "spaceName": "Space A" },
  { "spaceId": "space2", "spaceName": "Space B" },
  { "spaceId": "space3", "spaceName": "Space C" }
]
```

---

## 예시 5: 조건부 변환

### 삼항 연산자

**표현식**:

```jsonata
*.{
  "id": id,
  "name": name,
  "priceCategory": price < 100 ? "cheap" : price < 200 ? "medium" : "expensive"
}
```

**결과**:

```json
[
  { "id": 1, "name": "Product A", "priceCategory": "medium" },
  { "id": 2, "name": "Product B", "priceCategory": "expensive" },
  { "id": 3, "name": "Product C", "priceCategory": "medium" }
]
```

### 조건부 필드 포함

**표현식**:

```jsonata
*.{
  "id": id,
  "name": name,
  "discount": status = 'active' ? price * 0.1 : 0
}
```

---

## 예시 6: 문자열 처리

### 문자열 조작

**표현식**:

```jsonata
*.{
  "upperName": $uppercase(name),
  "lowerName": $lowercase(name),
  "nameLength": $length(name),
  "firstThree": $substring(name, 0, 3)
}
```

### 문자열 결합

**표현식**:

```jsonata
{
  "allNames": $join(*.name, ", "),
  "activeNames": $join([status='active'].name, " | ")
}
```

---

## 예시 7: 배열 처리

### 배열 정렬

**표현식**:

```jsonata
^(price)  /* 오름차순 */
```

**표현식 (내림차순)**:

```jsonata
^(>price)
```

### 배열 슬라이싱

**표현식**:

```jsonata
[0..1]  /* 처음 2개 */
```

---

## 예시 8: 복잡한 변환

### 그룹핑

**표현식**:

```jsonata
{
  "active": [status='active'],
  "inactive": [status='inactive']
}
```

### 계층 구조 생성

**표현식**:

```jsonata
{
  "summary": {
    "total": $count(*),
    "average": $average(*.price)
  },
  "items": *.{
    "id": id,
    "name": name
  }
}
```

---

## 자주 사용하는 패턴

### 패턴 1: 필터 후 필드 선택

```jsonata
[condition].{ "key": value }
```

### 패턴 2: 중복 제거

```jsonata
$distinct(*.field)
```

### 패턴 3: 배열 평탄화

```jsonata
*.nested[].field
```

### 패턴 4: 조건부 집계

```jsonata
$sum([condition].value)
```

### 패턴 5: 중첩 경로 탐색

```jsonata
level1.*.level2.*.level3
```

---

## 관련 문서

- [F-006: JSONata 테스팅](../F-006-JSONata-테스팅.md)
- [JSONata 고급 활용](./JSONata-고급활용.md)
- [JSONata 공식 문서](https://docs.jsonata.org/)

---

**변경 이력**

| 버전 | 날짜       | 변경 내용                | 작성자 |
| ---- | ---------- | ------------------------ | ------ |
| 1.0  | 2025-11-11 | F-006에서 예제 부분 분리 | System |
