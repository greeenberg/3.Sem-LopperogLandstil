# Website, LopperogLandstil

###Vores kodestil

1. Alt skal skrives på engelsk
2. Koden skal opdeles i funktionalitet, hold relateret funktioner tæt
3. END points på websiden er på dansk

###End points
*beskrivelse er over end point*
```
GET: http://lopperoglandstil.dk/

GET: http://lopperoglandstil.dk/admin
GET: http://lopperoglandstil.dk/session
```
- Returnerer Produkterne i databasen, :id er ObjectId på et specifikt produkt
```
GET: http://lopperoglandstil.dk/api/produkter
GET: http://lopperoglandstil.dk/api/produkter/:id
```
- Returnerer et array med den fulde sti til billedet
```
GET: http://lopperoglandstil.dk/api/produkter/:id/billeder
```

- req.body Parametere (name, desc, amount, categories, price)
```
POST: http://lopperoglandstil.dk/api/produkter
```

- req.files = array af billeder
```
POST: http://lopperoglandstil.dk/api/produkter/:id/uploadbilleder
```

- Sletter et eller flere billeder, _skal_ have en body med et array af den eller de billeder der skal slettes.
Eksempel: ["Billede1ID", "Billede2ID"], eller ["Billede1ID"]
```
DELETE: http://lopperoglandstil.dk/api/produkter/:id/sletBilleder
```

- Sletter produkt med objectId = :id
```
DELETE: http://lopperoglandstil.dk/api/produkter/:id
```

- opdaterer produktet med den specificerede id, 
skal have en body _kun_ med de parameter der skal opdateres.
Mulige parameter der kan opdateres er: <br>
{name: String, desc: String, amount: Number, unique: Boolean, categories: Array, price: Number, discount: Number, reservedAmount: Number}

```
PUT: http://lopperoglandstil.dk/api/produkter/:id
```

- Returnere et array med alle kategorier
```
GET: http://lopperoglandstil.dk/produktkategorier
```

- Opretter en ny kategori.
Parametre:
{name: String}
```
POST: http://lopperoglandstil.dk/api/produktkategorier
```

- Sletter en kategori
```
DELETE: http://lopperoglandstil.dk/api/produktkategorier/:kategori
```

 Returnere alle produkter der har denne kategori
```
GET: http://lopperoglandstil.dk/produktkategorier/:kategori
```


###Medlemmer
- Frank
- Frederik
- Ole
- Simon K
- Simon G
- Thomas


