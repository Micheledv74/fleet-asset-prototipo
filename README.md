# Fleet Asset · prototipo

Prototipo dimostrativo di un gestionale acquisti e magazzino di flotta, ridisegnato a partire dai flussi di InfoSHIP EVO Asset e dalla logica documentale di Danea Easyfatt.

App statica (HTML, CSS, JavaScript senza dipendenze), pubblicata con GitHub Pages. I dati restano nel browser (localStorage) e si esportano o importano in JSON dalla pagina Dati.

I dati pubblicati qui sono di esempio: struttura e documenti seguono InfoSHIP, fornitori e importi sono inventati. I dati reali si caricano solo in locale con "Importa JSON".

## Contenuto

- Home flotta con indicatori per nave
- Richieste, RFQ, ordini, consegne (DN) con elenchi uniformi, filtri e colonne a scelta
- Scheda documento con percorso di stato, prossimo passo, documenti collegati e cronologia
- DN chiusa solo dalla postazione Bordo con DN timbrata e firmata
- Magazzino a costo medio ponderato: carico da DN, consumo e rettifica da documenti di bordo, scorta minima e riordino
- Budget per centro di costo e conto, fornitori, scadenzario, ricerca globale
- Interfaccia italiano/inglese, tema chiaro/scuro
