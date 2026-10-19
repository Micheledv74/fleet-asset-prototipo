(function () {
  'use strict';

  /* ---------- storage ---------- */
  var KEY = 'fa_proto_v1', PKEY = 'fa_prefs_v1';
  var DB = loadDB();
  var P = loadPrefs();
  var UI = { expanded: {}, colOpen: false, results: [], resSel: 0, showZero: false };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function loadDB() {
    try { var s = localStorage.getItem(KEY); if (s) { var o = JSON.parse(s); if (o && o.meta && o.meta.version === window.SEED.meta.version) return o; } } catch (e) {}
    return clone(window.SEED);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} }
  function loadPrefs() {
    var d = { theme: '', lang: 'it', cols: {}, sort: {}, seat: 'office' };
    try { var s = JSON.parse(localStorage.getItem(PKEY) || '{}'); for (var k in s) d[k] = s[k]; } catch (e) {}
    return d;
  }
  function savePrefs() { try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) {} }
  function effTheme() { var a = document.documentElement.getAttribute('data-theme'); if (a === 'dark' || a === 'light') return a; try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch (e) { return 'light'; } }
  if (P.theme === 'dark' || P.theme === 'light') document.documentElement.setAttribute('data-theme', P.theme);

  /* ---------- i18n ---------- */
  var L = {
    fleet: ['Flotta', 'Fleet'], purchasing: ['Acquisti', 'Purchasing'], pms: ['PMS', 'PMS'], stores: ['Magazzino', 'Stores'],
    certs: ['Certificati', 'Certificates'], due: ['Scadenze', 'Due dates'], budget: ['Budget', 'Budget'], suppliers: ['Fornitori', 'Suppliers'],
    data: ['Dati', 'Data'], search: ['Cerca documenti, fornitori, conti… (numero InfoSHIP o nuovo)', 'Search documents, suppliers, accounts… (InfoSHIP or new number)'],
    openRQ: ['Richieste aperte', 'Open requisitions'], toWork: ['da lavorare', 'to process'], rfqWait: ['RFQ in attesa', 'RFQs awaiting quote'],
    overLimit: ['oltre il limite', 'past the limit'], poOpen: ['Ordini aperti', 'Open orders'], late: ['in ritardo', 'late'],
    dnOpen: ['Spedizioni verso bordo', 'Shipments to vessel'], notRecv: ['non ricevute a bordo', 'not received on board'],
    openShip: ['Apri scheda nave', 'Open vessel'], noData: ['Non ancora inserita in InfoSHIP. Nessun documento da importare.', 'Not yet in InfoSHIP. No documents to import.'],
    rm: ['Repair & Maintenance', 'Repair & Maintenance'], used: ['usato', 'used'], prorata: ['pro rata a oggi', 'pro rata to date'],
    extra: ['Extra budget senza copertura', 'Extra budget, not covered'], orderedMonth: ['Ordinato nel mese', 'Ordered this month'],
    toChase: ['Ordini da sollecitare', 'Orders to chase'], all: ['tutti', 'all'], shipNotRecv: ['Spedizioni non confermate a bordo', 'Shipments not confirmed on board'],
    shipNotRecvTxt: ['Finché la nave non conferma la DN firmata, il magazzino di bordo non si aggiorna e la fattura non si può registrare.', 'Until the vessel confirms the signed DN, onboard stock is not updated and the invoice cannot be booked.'],
    rfqLate: ['RFQ oltre la data limite', 'RFQs past quotation limit'],
    RQ: ['Richieste', 'Requisitions'], RFQ: ['RFQ', 'RFQs'], PO: ['Ordini', 'Orders'], DN: ['Consegne', 'Deliveries'], FT: ['Fatture', 'Invoices'],
    RQ1: ['Richiesta nave', 'Ship requisition'], RFQ1: ['Richiesta di offerta', 'Request for quotation'], PO1: ['Ordine', 'Purchase order'], DN1: ['Consegna (DN)', 'Delivery note'],
    allShips: ['Tutte le navi', 'All vessels'], allStatus: ['Tutti gli stati', 'All statuses'], onlyLate: ['Solo in ritardo', 'Late only'],
    filterTxt: ['Filtra in questo elenco', 'Filter this list'], columns: ['Colonne', 'Columns'], rows: ['righe', 'rows'],
    c_num: ['Numero', 'Number'], c_orig: ['Rif. InfoSHIP', 'InfoSHIP ref.'], c_ship: ['Nave', 'Vessel'], c_desc: ['Descrizione', 'Description'],
    c_status: ['Stato', 'Status'], c_date: ['Data', 'Date'], c_dept: ['Reparto', 'Department'], c_side: ['In carico a', 'Held by'],
    c_due: ['Consegna richiesta', 'Required by'], c_quote: ['Offerte', 'Quotes'], c_sup: ['Fornitore', 'Supplier'], c_total: ['Totale', 'Total'],
    c_eur: ['Controvalore €', 'EUR value'], c_usd: ['Controvalore $', 'USD value'], c_limit: ['Limite offerta', 'Quotation limit'], c_deliverTo: ['Consegna a', 'Deliver to'],
    c_from: ['Nasce da', 'Created from'],
    office: ['Ufficio', 'Office'], ship: ['Bordo', 'Vessel'], toship: ['In invio a bordo', 'Sending to vessel'],
    ENG: ['Macchina', 'Engine'], DECK: ['Coperta', 'Deck'], SAFETY: ['Sicurezza', 'Safety'], CARGO: ['Carico', 'Cargo'], VESSEL: ['Nave', 'Vessel'],
    path: ['Percorso', 'Workflow'], next: ['Prossimo passo', 'Next step'], cancel: ['Annulla', 'Cancel'], chain: ['Documenti collegati', 'Linked documents'],
    history: ['Cronologia', 'History'], lines: ['Righe', 'Lines'], noLines: ['Le righe non sono negli export lista di InfoSHIP: per questo documento il prototipo mostra solo la testata. La pratica demo (blocco 2) avrà le righe complete.', 'Lines are not included in InfoSHIP list exports: the prototype shows only the header for this document. The demo case (block 2) will have full lines.'],
    noChain: ['Nessun documento collegato trovato.', 'No linked documents found.'], details: ['Dati del documento', 'Document data'],
    terms: ['Condizioni', 'Terms'], closed: ['Pratica chiusa: nessuna azione da fare.', 'Closed: nothing to do.'], optional: ['facoltativo', 'optional'],
    reason: ['Motivo', 'Reason'], confirm: ['Conferma', 'Confirm'], close: ['Chiudi', 'Close'], note: ['Nota', 'Note'],
    offerTotal: ['Totale offerta', 'Offer total'], currency: ['Valuta', 'Currency'], validDays: ['Validità (giorni)', 'Validity (days)'], extRef: ['Rif. offerta fornitore', 'Supplier quote ref.'],
    done: ['Fatto', 'Done'], budgetFor: ['Budget', 'Budget'], showZero: ['Mostra voci a zero', 'Show zero lines'],
    b_budget: ['Budget annuo', 'Annual budget'], b_ord: ['Ordinato', 'Ordered'], b_del: ['Consegnato', 'Delivered'], b_rem: ['Residuo', 'Remaining'], b_use: ['Utilizzo', 'Usage'], b_pr: ['Pro rata oggi', 'Pro rata today'],
    b_note: ['Ordinato e consegnato 2026 come da report InfoSHIP "Budget vs Cost". Budget mensile = annuo / 12.', 'Ordered and delivered 2026 as per InfoSHIP "Budget vs Cost" report. Monthly budget = annual / 12.'],
    sup_n: ['Fornitori', 'Suppliers'], s_rfq: ['RFQ', 'RFQs'], s_po: ['Ordini', 'Orders'], s_ord: ['Ordinato €', 'Ordered €'], s_ref: ['Rifiuti RFQ', 'RFQ refusals'], s_last: ['Ultimo documento', 'Last document'],
    s_hist: ['Storico documenti', 'Document history'], s_cur: ['Valuta abituale', 'Usual currency'],
    sc_title: ['Scadenzario', 'Due dates'], sc_over: ['Scaduti', 'Overdue'], sc_next: ['Prossimi 14 giorni', 'Next 14 days'], sc_later: ['Più avanti', 'Later'],
    sc_note: ['Pagamenti fornitori e certificati entrano qui con i moduli Fatture e Certificati.', 'Supplier payments and certificates will appear here with the Invoices and Certificates modules.'],
    sc_rfq: ['Limite offerta', 'Quotation limit'], sc_po: ['Consegna ordine', 'Order delivery'], sc_dn: ['Arrivo a bordo', 'Arrival on board'], sc_rq: ['Richiesta da bordo', 'Required on board'],
    soon: ['Modulo in preparazione', 'Module in preparation'], soonTxt: ['Questo modulo arriva nei prossimi blocchi del prototipo. La struttura dati è già prevista.', 'This module comes in the next prototype blocks. The data structure is already in place.'],
    d_title: ['Dati del prototipo', 'Prototype data'], d_src: ['Origine dati', 'Data source'], d_export: ['Esporta JSON', 'Export JSON'], d_import: ['Importa JSON', 'Import JSON'], d_reset: ['Ripristina dati export InfoSHIP', 'Reset to InfoSHIP export data'],
    d_txt: ['I dati restano solo in questo browser. Esporta un file JSON per salvarli o portarli su un altro computer.', 'Data stays in this browser only. Export a JSON file to keep it or move it to another computer.'],
    d_resetQ: ['Tutte le modifiche fatte nel prototipo andranno perse. Continuare?', 'All changes made in the prototype will be lost. Continue?'],
    recent: ['Ultimi documenti', 'Recent documents'], modules: ['Moduli', 'Modules'], inPrep: ['in preparazione', 'in preparation'],
    kind_cargo: ['Cargo', 'Cargo'], kind_stone: ['Stone dumping vessel', 'Stone dumping vessel'], kind_research: ['Nave da ricerca · 16 m', 'Research vessel · 16 m'],
    today: ['oggi', 'today'], daysLate: ['gg di ritardo', 'days late'], results: ['risultati', 'results'], noResults: ['Nessun risultato', 'No results'],
    seatOffice: ['Postazione: Ufficio', 'Station: Office'], seatShip: ['Postazione: Bordo', 'Station: Vessel'],
    onlyShip: ['La conferma spetta a bordo: la DN timbrata e firmata chiude la consegna e carica il magazzino.', 'Confirmation is done on board: the stamped and signed DN closes the delivery and loads the stores.'],
    toShipSeat: ['Passa alla postazione Bordo', 'Switch to Vessel station'], onlyShipAct: ['Azione di bordo', 'Vessel action'],
    l_row: ['Riga', 'Row'], l_code: ['Codice', 'Code'], l_uom: ['UM', 'UOM'], l_qty: ['Q.tà', 'Qty'], l_price: ['Prezzo', 'Price'], l_disc: ['Sconto', 'Disc.'],
    l_net: ['Importo', 'Amount'], l_due: ['Consegna', 'Delivery'], l_recv: ['Ricevuto', 'Received'], l_res: ['Residuo', 'Open'], l_ship: ['Spedito', 'Shipped'],
    goods: ['Merce', 'Goods'], ch_transport: ['Trasporto', 'Transport'], ch_packing: ['Imballo', 'Packing'], ch_other: ['Altre spese', 'Other charges'], grand: ['Totale documento', 'Document total'],
    rcvTitle: ['Ricevuta a bordo', 'Received on board'], rcvTxt: ['Indica le quantità effettivamente ricevute. Le differenze restano aperte sull\'ordine.', 'Enter the quantities actually received. Differences stay open on the order.'],
    signed: ['DN timbrata e firmata dal Comandante / Direttore di macchina', 'DN stamped and signed by Master / Chief Engineer'], signedFile: ['Scansione o foto della DN firmata', 'Scan or photo of the signed DN'],
    signedReq: ['Senza DN firmata la consegna non si chiude.', 'Without the signed DN the delivery cannot be closed.'],
    st_items: ['Articoli', 'Items'], st_moves: ['Movimenti', 'Movements'], st_docs: ['Documenti di magazzino', 'Stores documents'],
    st_stock: ['Giacenza', 'On hand'], st_incoming: ['In arrivo', 'Incoming'], st_min: ['Scorta min.', 'Min. stock'], st_avg: ['Costo medio €', 'Avg cost €'], st_val: ['Valore €', 'Value €'],
    st_lastSup: ['Ultimo fornitore', 'Last supplier'], st_lastPrice: ['Ultimo prezzo €', 'Last price €'], st_under: ['Sotto scorta', 'Below minimum'], st_withStock: ['Solo con giacenza', 'On hand only'],
    st_generic: ['Solo codici generici GI0001', 'Generic GI0001 only'], st_value: ['Valore magazzino', 'Stores value'], st_nItems: ['Articoli gestiti', 'Items managed'],
    st_genShare: ['righe d\'ordine con codice generico GI0001', 'order lines with generic code GI0001'], st_reorder: ['Crea richiesta per gli articoli sotto scorta', 'Create requisition for items below minimum'],
    st_consume: ['Registra consumo', 'Record consumption'], st_count: ['Rettifica da inventario', 'Inventory adjustment'], st_cause: ['Causale', 'Reason'],
    st_counted: ['Quantità contata', 'Counted quantity'], st_progr: ['Progressivo', 'Running'], st_prices: ['Storico prezzi', 'Price history'], st_none: ['Nessun movimento.', 'No movements.'],
    st_note: ['Il magazzino si muove solo con documenti: la DN ricevuta a bordo carica, il consumo e la rettifica d\'inventario scaricano. Costo medio ponderato in euro.', 'Stores move only through documents: a DN received on board loads, consumption and inventory adjustments unload. Weighted average cost in EUR.'],
    k_carico: ['Carico da DN', 'Receipt from DN'], k_scarico: ['Consumo', 'Consumption'], k_rettifica: ['Rettifica inventario', 'Inventory adjustment'],
    CS1: ['Consumo di bordo', 'Onboard consumption'], INV1: ['Rettifica inventario', 'Inventory adjustment'], minSaved: ['Scorta minima salvata', 'Minimum saved'],
    acct: ['Conto', 'Account'], fxLabel: ['Cambio EUR/USD', 'EUR/USD rate'], theme: ['Tema chiaro/scuro', 'Light/dark theme'],
    rmShort: ['R&M', 'R&M'], quoteW: ['in attesa', 'waiting'], quoteA: ['accettata', 'accepted'], appr: ['Approvazione', 'Approval'],
    impact: ['Impatto sul budget', 'Budget impact'], impactTxt: ['Il conto di budget si assegna sulle righe: con le testate importate l\'impatto non è calcolabile.', 'The budget account is set on lines: with imported headers the impact cannot be computed.']
  };
  function t(k) { var v = L[k]; return v ? v[P.lang === 'en' ? 1 : 0] : k; }

  var ST = {
    RQ: { bozza: ['Bozza', 'Draft'], endorsed: ['Endorsed', 'Endorsed'], verifica: ['Verifica ufficio', 'Office review'], quotazione: ['In quotazione', 'Price sourcing'], quotata: ['Quotata', 'Priced'], ordinata: ['Ordinata', 'Ordered'], chiusa: ['Chiusa', 'Closed'], annullata: ['Annullata', 'Cancelled'] },
    RFQ: { creata: ['Creata', 'Created'], inviata: ['Inviata', 'Sent to vendor'], quotata: ['Offerta ricevuta', 'Offer received'], rifiutata: ['Rifiutata', 'Refused'], annullata: ['Annullata', 'Cancelled'] },
    PO: { bozza: ['Bozza', 'Draft'], approvato: ['Approvato', 'Approved'], inviato: ['Inviato', 'Published'], confermato: ['Confermato', 'Confirmed'], finalizzato: ['Finalizzato', 'Finalized'], annullato: ['Annullato', 'Cancelled'] },
    DN: { pronta: ['Pronta per spedizione', 'Ready for shipment'], spedita: ['Spedita alla nave', 'Shipped to vessel'], ricevuta: ['Ricevuta a bordo', 'Received on board'] },
    CS: { registrato: ['Registrato', 'Recorded'] }, INV: { registrato: ['Registrato', 'Recorded'] }
  };
  var TONE = { bozza: 'neutral', creata: 'neutral', endorsed: 'warn', verifica: 'info', quotazione: 'info', inviata: 'info', inviato: 'info', quotata: 'acc', approvato: 'acc', confermato: 'info', ordinata: 'ok', finalizzato: 'ok', pronta: 'warn', spedita: 'info', ricevuta: 'ok', chiusa: 'neutral', annullata: 'bad', annullato: 'bad', rifiutata: 'bad', registrato: 'ok' };
  var FLOW = {
    RQ: ['bozza', 'endorsed', 'verifica', 'quotazione', 'quotata', 'ordinata', 'chiusa'],
    RFQ: ['creata', 'inviata', 'quotata'],
    PO: ['bozza', 'approvato', 'inviato', 'confermato', 'finalizzato'],
    DN: ['pronta', 'spedita', 'ricevuta'],
    CS: ['registrato'], INV: ['registrato']
  };
  var OPTIONAL = { PO: { confermato: 1 } };
  var NEG = { annullata: 1, annullato: 1, rifiutata: 1 };
  var ACT = {
    RQ: {
      bozza: [{ to: 'endorsed', l: ['Endorsement di bordo', 'Endorse on board'], ship: 1 }],
      endorsed: [{ to: 'verifica', l: ['Prendi in carico in ufficio', 'Take over in office'] }],
      verifica: [{ to: 'quotazione', l: ['Richiedi quotazioni', 'Request quotations'] }],
      quotazione: [{ to: 'quotata', l: ['Segna come quotata', 'Mark as priced'] }],
      quotata: [{ to: 'ordinata', l: ['Crea ordini dalla scelta', 'Create orders from selection'] }],
      ordinata: [{ to: 'chiusa', l: ['Chiudi richiesta', 'Close requisition'] }]
    },
    RFQ: {
      creata: [{ to: 'inviata', l: ['Invia al fornitore', 'Send to vendor'] }],
      inviata: [{ to: 'quotata', l: ['Registra offerta', 'Record offer'], form: 'offer' }, { to: 'rifiutata', l: ['Il fornitore non quota', 'Vendor declines'], sec: 1 }]
    },
    PO: {
      bozza: [{ to: 'approvato', l: ['Approva ordine', 'Approve order'], form: 'approve' }],
      approvato: [{ to: 'inviato', l: ['Invia al fornitore', 'Send to vendor'] }],
      inviato: [{ to: 'finalizzato', l: ['Finalizza ordine', 'Finalize order'] }, { to: 'confermato', l: ['Registra conferma fornitore', 'Record vendor confirmation'], sec: 1 }],
      confermato: [{ to: 'finalizzato', l: ['Finalizza ordine', 'Finalize order'] }]
    },
    DN: {
      pronta: [{ to: 'spedita', l: ['Spedita alla nave', 'Shipped to vessel'] }],
      spedita: [{ to: 'ricevuta', l: ['Ricevuta a bordo (DN firmata)', 'Received on board (signed DN)'], form: 'receive', ship: 1 }]
    }
  };
  var CANCEL = { RQ: 'annullata', RFQ: 'annullata', PO: 'annullato' };
  var OPEN = {
    RQ: { bozza: 1, endorsed: 1, verifica: 1, quotazione: 1, quotata: 1 },
    RFQ: { creata: 1, inviata: 1 },
    PO: { bozza: 1, approvato: 1, inviato: 1, confermato: 1 },
    DN: { pronta: 1, spedita: 1 }
  };
  function stLabel(d) { var x = ST[d.type][d.status]; return x ? x[P.lang === 'en' ? 1 : 0] : d.status; }
  function chip(d) { return '<span class="chip c-' + (TONE[d.status] || 'neutral') + '">' + esc(stLabel(d)) + '</span>'; }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  var TODAY = todayISO();
  function fd(s) { if (!s) return '—'; var p = s.split('-'); return p[2] + '-' + p[1] + '-' + p[0]; }
  function loc() { return P.lang === 'en' ? 'en-GB' : 'it-IT'; }
  function nf(v, dec) { return (v || 0).toLocaleString(loc(), { minimumFractionDigits: dec == null ? 2 : dec, maximumFractionDigits: dec == null ? 2 : dec }); }
  function money(v, cur) { return nf(v) + (cur === 'USD' ? ' $' : ' €'); }
  function fx() { return DB.meta.fx || 1; }
  function toEur(v, cur) { return cur === 'USD' ? v / fx() : v; }
  function toUsd(v, cur) { return cur === 'USD' ? v : v * fx(); }
  function daysBetween(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5); }
  function byId(id) { for (var i = 0; i < DB.docs.length; i++) if (DB.docs[i].id === id) return DB.docs[i]; return null; }
  function supName(id) { for (var i = 0; i < DB.suppliers.length; i++) if (DB.suppliers[i].id === id) return DB.suppliers[i].name; return ''; }
  function supById(id) { for (var i = 0; i < DB.suppliers.length; i++) if (DB.suppliers[i].id === id) return DB.suppliers[i]; return null; }
  function shipBy(c) { for (var i = 0; i < DB.ships.length; i++) if (DB.ships[i].code === c) return DB.ships[i]; return null; }
  function docs(f) { return DB.docs.filter(f); }
  function isOpen(d) { return !!(OPEN[d.type] && OPEN[d.type][d.status]); }
  function lateDate(d) { return d.type === 'RFQ' ? d.limit : d.due; }
  function isLate(d) { var x = lateDate(d); return isOpen(d) && !!x && x < TODAY && (d.type !== 'RQ' || d.status !== 'quotata'); }
  function qs(o) { var a = []; for (var k in o) if (o[k] != null && o[k] !== '') a.push(k + '=' + encodeURIComponent(o[k])); return a.length ? '?' + a.join('&') : ''; }
  function ico(name) {
    var p = {
      fleet: 'M3 17c3 3 6 3 9 0 3 3 6 3 9 0M6 14l1-6h10l1 6M12 8V4', cart: 'M4 5h2l2 11h10l2-8H7M10 20h.01M17 20h.01',
      gear: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
      box: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8', doc: 'M6 3h9l4 4v14H6zM9 12h7M9 16h7',
      cal: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4', chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      ppl: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5M16 4a3 3 0 010 6M18 14c2 1 3 3 3 6',
      db: 'M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0zM4 6c0 2 16 2 16 0M4 12c0 2 16 2 16 0',
      search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5', moon: 'M20 14A8 8 0 0110 4a8 8 0 1010 10z',
      sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5'
    }[name];
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>';
  }
  function toast(msg) {
    var el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2200);
  }

  /* ---------- computations ---------- */
  function kpiShip(code) {
    var f = function (d) { return !code || d.ship === code; };
    var rq = docs(function (d) { return f(d) && d.type === 'RQ' && isOpen(d); });
    var rfq = docs(function (d) { return f(d) && d.type === 'RFQ' && d.status === 'inviata'; });
    var po = docs(function (d) { return f(d) && d.type === 'PO' && isOpen(d); });
    var dn = docs(function (d) { return f(d) && d.type === 'DN' && isOpen(d); });
    var ym = TODAY.slice(0, 7);
    var month = docs(function (d) { return f(d) && d.type === 'PO' && d.status !== 'annullato' && d.date && d.date.slice(0, 7) === ym; });
    return {
      rq: rq.length, rqTodo: rq.filter(function (d) { return d.status === 'endorsed'; }).length,
      rfq: rfq.length, rfqLate: rfq.filter(isLate).length,
      po: po.length, poLate: po.filter(isLate).length, poVal: po.reduce(function (s, d) { return s + toEur(d.total || 0, d.cur); }, 0),
      dn: dn.length, dnLate: dn.filter(isLate).length,
      month: month.reduce(function (s, d) { return s + toEur(d.total || 0, d.cur); }, 0), monthN: month.length
    };
  }
  function acctMap() { var m = {}; DB.accounts.forEach(function (a) { m[a.path] = a; }); return m; }
  function budgetAgg(ship) {
    var A = acctMap(), out = {};
    DB.accounts.forEach(function (a) { out[a.path] = { b: 0, o: 0, d: 0 }; });
    var B = DB.budgets[ship] || {};
    Object.keys(B).forEach(function (p) {
      var v = B[p], cur = p;
      while (cur) { var o = out[cur]; if (o) { o.b += v.b; o.o += v.o; o.d += v.d; } cur = A[cur] ? A[cur].parent : null; }
    });
    return out;
  }
  function yearFrac() { var y = TODAY.slice(0, 4); return Math.min(1, (daysBetween(y + '-01-01', TODAY) + 1) / 365); }
  function chainRoot(d) {
    var cur = d, guard = 0;
    while (cur && cur.from && cur.from.length && guard < 6) { var p = byId(cur.from[0]); if (!p) break; cur = p; guard++; }
    return cur;
  }
  function children(id) { return DB.docs.filter(function (x) { return x.from && x.from.indexOf(id) >= 0; }); }

  /* ---------- shell ---------- */
  var root = document.getElementById('app');
  function route() {
    var h = location.hash.replace(/^#/, '') || '/';
    var qi = h.indexOf('?'), path = qi >= 0 ? h.slice(0, qi) : h, q = {};
    if (qi >= 0) h.slice(qi + 1).split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) q[p[0]] = decodeURIComponent(p[1] || ''); });
    var seg = path.split('/').filter(Boolean);
    return { seg: seg, q: q };
  }
  function railLink(href, icon, label, on) { return '<a href="' + href + '" class="' + (on ? 'on' : '') + '">' + ico(icon) + esc(label) + '</a>'; }
  function shell(active, crumbs, title, body) {
    var r = route();
    var ship = r.q.nave || (active === 'ship' ? r.seg[1] : '');
    return '<div class="app">' +
      '<nav class="rail" aria-label="' + esc(t('fleet')) + '"><div class="brand">' + esc(ship || 'FLEET') + '</div>' +
      railLink('#/', 'fleet', t('fleet'), active === 'home' || active === 'ship') +
      railLink('#/docs' + qs({ tipo: 'RQ', nave: ship }), 'cart', t('purchasing'), active === 'docs' || active === 'doc') +
      railLink('#/modulo/pms', 'gear', t('pms'), active === 'pms') +
      railLink('#/magazzino' + qs({ nave: ship || 'PEP' }), 'box', t('stores'), active === 'magazzino') +
      railLink('#/modulo/certificati', 'doc', t('certs'), active === 'certificati') +
      railLink('#/scadenze' + qs({ nave: ship }), 'cal', t('due'), active === 'scadenze') +
      railLink('#/budget' + qs({ nave: ship || 'PEP' }), 'chart', t('budget'), active === 'budget') +
      railLink('#/fornitori', 'ppl', t('suppliers'), active === 'fornitori') +
      '<div class="sp"></div>' + railLink('#/dati', 'db', t('data'), active === 'dati') +
      '</nav><div class="main"><header class="top">' +
      '<div class="crumbs"><small>' + crumbs + '</small><b>' + esc(title) + '</b></div>' +
      '<div class="search"><label>' + ico('search') + '<input id="gsearch" type="search" autocomplete="off" aria-label="' + esc(t('search')) + '" placeholder="' + esc(t('search')) + '"><span class="kbd j">Ctrl K</span></label><div id="gres"></div></div>' +
      '<div class="tools">' + (DB.meta.demo ? '<a class="chip c-warn" href="#/dati" style="text-decoration:none">' + esc(P.lang === 'en' ? 'Sample data' : 'Dati di esempio') + '</a>' : '') + '<label class="fx j" title="' + esc(t('fxLabel')) + '">1 € = <input id="fxin" class="j" value="' + nf(fx(), 4) + '" aria-label="' + esc(t('fxLabel')) + '"> $</label>' +
      '<button class="btn sm' + (P.seat === 'ship' ? ' pri' : '') + '" data-act="seat">' + esc(t(P.seat === 'ship' ? 'seatShip' : 'seatOffice')) + '</button>' +
      '<button class="btn sm j" data-act="lang">' + (P.lang === 'en' ? 'EN · it' : 'IT · en') + '</button>' +
      '<button class="btn sm" data-act="theme" aria-label="' + esc(t('theme')) + '" title="' + esc(t('theme')) + '">' + ico(effTheme() === 'dark' ? 'sun' : 'moon') + '</button></div>' +
      '</header><div class="page">' + body + '</div></div></div>';
  }
  function crumb(parts) { return parts.map(function (p) { return p[1] ? '<a href="' + p[1] + '">' + esc(p[0]) + '</a>' : esc(p[0]); }).join(' › '); }

  /* ---------- pages ---------- */
  function pageHome() {
    var k = kpiShip(null);
    var tot = '<div class="kpis">' +
      kpiBox(t('openRQ'), k.rq, k.rqTodo + ' ' + t('toWork'), 'warn', '#/docs' + qs({ tipo: 'RQ' })) +
      kpiBox(t('rfqWait'), k.rfq, k.rfqLate + ' ' + t('overLimit'), k.rfqLate ? 'bad' : 'mute', '#/docs' + qs({ tipo: 'RFQ', stato: 'inviata' })) +
      kpiBox(t('poOpen'), k.po, k.poLate + ' ' + t('late'), k.poLate ? 'bad' : 'mute', '#/docs' + qs({ tipo: 'PO', aperti: 1 })) +
      kpiBox(t('dnOpen'), k.dn, t('notRecv'), 'mute', '#/docs' + qs({ tipo: 'DN', aperti: 1 })) + '</div>';
    var cards = DB.ships.map(shipCard).join('');
    var late = docs(function (d) { return d.type === 'PO' && isLate(d); }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    var lateHtml = late.slice(0, 6).map(function (d) {
      return '<a href="#/doc/' + d.id + '" style="text-decoration:none;color:var(--ink);border-top:1px solid var(--line);padding-top:9px;display:flex;flex-direction:column;gap:2px">' +
        '<div style="display:flex;justify-content:space-between;gap:8px"><span class="j" style="font-size:12px;color:var(--teal);font-weight:600">' + esc(d.num) + '</span><span class="t-bad" style="font-size:11px;font-weight:800">' + daysBetween(d.due, TODAY) + ' ' + esc(t('daysLate')) + '</span></div>' +
        '<span style="font-size:13px;font-weight:600">' + esc(d.desc) + '</span><span class="mute" style="font-size:12px">' + esc(supName(d.sup)) + ' · <span class="j">' + money(d.total, d.cur) + '</span></span></a>';
    }).join('');
    var dnBy = DB.ships.map(function (s) { var n = docs(function (d) { return d.ship === s.code && d.type === 'DN' && d.status === 'spedita'; }).length; return n ? s.code + ' ' + n : null; }).filter(Boolean).join(' · ');
    var dnTot = docs(function (d) { return d.type === 'DN' && d.status === 'spedita'; }).length;
    var side = '<aside class="side">' +
      '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:baseline"><h2>' + esc(t('toChase')) + '</h2><a href="#/docs' + qs({ tipo: 'PO', late: 1 }) + '" style="font-size:12px">' + esc(t('all')) + ' (' + late.length + ')</a></div>' + lateHtml + '</section>' +
      '<section class="next"><div class="t">' + esc(t('shipNotRecv')) + '</div><div class="j" style="font-size:22px;font-weight:600">' + dnTot + '</div><div class="mute" style="font-size:12px">' + esc(dnBy) + '</div><div style="font-size:13px;line-height:1.5">' + esc(t('shipNotRecvTxt')) + '</div><a href="#/docs' + qs({ tipo: 'DN', stato: 'spedita' }) + '" style="font-weight:700;font-size:13px">' + esc(t('all')) + ' →</a></section>' +
      '</aside>';
    var title = new Date().toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return shell('home', esc(title), t('fleet'), tot + '<div class="row"><section class="grow ships" aria-label="' + esc(t('fleet')) + '">' + cards + '</section>' + side + '</div>');
  }
  function kpiBox(l, n, s, tone, href) {
    return '<a class="kpi" href="' + href + '"><span class="l">' + esc(l) + '</span><span class="n j">' + n + '</span><span class="s t-' + tone + '">' + esc(s) + '</span></a>';
  }
  function miniBox(l, n, s, tone, href) {
    return '<a href="' + href + '"><span class="l">' + esc(l) + '</span><span class="n j">' + n + '</span><span class="s t-' + tone + '">' + esc(s) + '</span></a>';
  }
  function shipBudgetBlock(code) {
    if (!DB.budgets[code]) return '';
    var B = budgetAgg(code), rm = B['00'] || { b: 0, o: 0, d: 0 }, ex = B['20'] || { b: 0, o: 0, d: 0 };
    var u = rm.b ? (rm.o + rm.d) / rm.b : 0, pr = yearFrac();
    var wd = Math.min(100, rm.b ? rm.d / rm.b * 100 : 0), wo = Math.min(100 - wd, rm.b ? rm.o / rm.b * 100 : 0);
    var exTot = ex.o + ex.d;
    return '<div class="stack" style="gap:6px"><div style="display:flex;justify-content:space-between;font-size:12px"><span class="mute">' + esc(t('rm')) + ' 2026</span><span class="j" style="font-weight:600">' + nf(rm.o + rm.d, 0) + ' / ' + nf(rm.b, 0) + ' €</span></div>' +
      '<div class="bar" role="img" aria-label="' + Math.round(u * 100) + '%"><i style="width:' + wd + '%;background:var(--bar1)"></i><i style="width:' + wo + '%;background:var(--bar2)"></i></div>' +
      '<div style="font-size:12px" class="' + (u > pr ? 't-bad' : 'mute') + '">' + esc(t('used')) + ' ' + Math.round(u * 100) + '% · ' + esc(t('prorata')) + ' ' + Math.round(pr * 100) + '%</div>' +
      (exTot > 0 ? '<div style="font-size:12px" class="t-bad">' + esc(t('extra')) + ': <span class="j">' + nf(exTot, 0) + ' €</span></div>' : '') + '</div>';
  }
  function shipCard(s) {
    var head = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div><h2>' + esc(s.name) + '</h2><span class="mute" style="font-size:12px">' + esc(t('kind_' + s.kind)) + '</span></div><span class="code j">' + s.code + '</span></div>';
    if (!s.infoship) return '<article class="ship">' + head + '<div class="empty">' + esc(t('noData')) + '</div><a class="btn" style="align-self:flex-start" href="#/nave/' + s.code + '">' + esc(t('openShip')) + ' →</a></article>';
    var k = kpiShip(s.code);
    return '<article class="ship">' + head + '<div class="mini">' +
      miniBox(t('openRQ'), k.rq, k.rqTodo + ' ' + t('toWork'), 'warn', '#/docs' + qs({ tipo: 'RQ', nave: s.code })) +
      miniBox(t('rfqWait'), k.rfq, k.rfqLate + ' ' + t('overLimit'), k.rfqLate ? 'bad' : 'mute', '#/docs' + qs({ tipo: 'RFQ', nave: s.code, stato: 'inviata' })) +
      miniBox(t('poOpen'), k.po, k.poLate + ' ' + t('late'), k.poLate ? 'bad' : 'mute', '#/docs' + qs({ tipo: 'PO', nave: s.code, aperti: 1 })) +
      miniBox(t('dnOpen'), k.dn, t('notRecv'), 'mute', '#/docs' + qs({ tipo: 'DN', nave: s.code, aperti: 1 })) +
      '</div>' + shipBudgetBlock(s.code) +
      '<a class="btn" style="align-self:flex-start;font-weight:700" href="#/nave/' + s.code + '">' + esc(t('openShip')) + ' →</a></article>';
  }

  function pageShip(code) {
    var s = shipBy(code); if (!s) return pageHome();
    var body;
    if (!s.infoship) {
      body = '<div class="card"><div class="empty">' + esc(t('noData')) + '</div></div>';
    } else {
      var k = kpiShip(code);
      var rec = docs(function (d) { return d.ship === code; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 12);
      body = '<div class="kpis">' +
        kpiBox(t('openRQ'), k.rq, k.rqTodo + ' ' + t('toWork'), 'warn', '#/docs' + qs({ tipo: 'RQ', nave: code })) +
        kpiBox(t('rfqWait'), k.rfq, k.rfqLate + ' ' + t('overLimit'), k.rfqLate ? 'bad' : 'mute', '#/docs' + qs({ tipo: 'RFQ', nave: code, stato: 'inviata' })) +
        kpiBox(t('poOpen'), k.po, k.poLate + ' ' + t('late') + ' · ' + nf(k.poVal, 0) + ' €', k.poLate ? 'bad' : 'mute', '#/docs' + qs({ tipo: 'PO', nave: code, aperti: 1 })) +
        kpiBox(t('dnOpen'), k.dn, t('notRecv'), 'mute', '#/docs' + qs({ tipo: 'DN', nave: code, aperti: 1 })) + '</div>' +
        '<div class="row"><div class="grow stack"><h2 style="margin:0;font-size:15px">' + esc(t('modules')) + '</h2><div class="mod">' +
        '<a href="#/docs' + qs({ tipo: 'RQ', nave: code }) + '"><b>' + esc(t('purchasing')) + '</b><span class="n j">' + docs(function (d) { return d.ship === code && isOpen(d); }).length + '</span><span class="mute" style="font-size:12px">' + esc(P.lang === 'en' ? 'open documents' : 'documenti aperti') + '</span></a>' +
        '<a href="#/budget' + qs({ nave: code }) + '"><b>' + esc(t('budget')) + '</b>' + shipBudgetBlock(code) + '</a>' +
        '<a href="#/scadenze' + qs({ nave: code }) + '"><b>' + esc(t('due')) + '</b><span class="n j">' + docs(function (d) { return d.ship === code && isLate(d); }).length + '</span><span class="t-bad" style="font-size:12px">' + esc(t('sc_over')) + '</span></a>' +
        '<a class="off" href="#/modulo/pms"><b>' + esc(t('pms')) + '</b><span class="mute" style="font-size:12px">' + esc(t('inPrep')) + '</span></a>' +
        '<a class="off" href="#/modulo/magazzino"><b>' + esc(t('stores')) + '</b><span class="mute" style="font-size:12px">' + esc(t('inPrep')) + '</span></a>' +
        '<a class="off" href="#/modulo/certificati"><b>' + esc(t('certs')) + '</b><span class="mute" style="font-size:12px">' + esc(t('inPrep')) + '</span></a></div>' +
        '<h2 style="margin:8px 0 0;font-size:15px">' + esc(t('recent')) + '</h2>' + gridTable(rec, ['num', 'type', 'desc', 'status', 'sup', 'date'], null, null) + '</div></div>';
    }
    return shell('ship', crumb([[t('fleet'), '#/']]) + ' · ' + esc(t('kind_' + s.kind)), s.name + ' · ' + s.code, body);
  }

  /* ---------- lists ---------- */
  var COLS = {
    num: { l: 'c_num', v: function (d) { return '<span class="j" style="color:var(--teal);font-weight:600">' + esc(d.num) + '</span>'; }, s: function (d) { return d.num; } },
    orig: { l: 'c_orig', v: function (d) { return '<span class="j mute" style="font-size:12px">' + esc(d.orig || '') + '</span>'; }, s: function (d) { return d.orig || ''; } },
    type: { l: 'c_num', v: function (d) { return esc(t(d.type + '1')); }, s: function (d) { return d.type; } },
    ship: { l: 'c_ship', v: function (d) { return '<span class="code j">' + d.ship + '</span>'; }, s: function (d) { return d.ship; } },
    desc: { l: 'c_desc', v: function (d) { return esc(d.desc); }, s: function (d) { return d.desc.toUpperCase(); } },
    status: { l: 'c_status', v: function (d) { return chip(d) + (isLate(d) ? ' <span class="chip c-bad">' + esc(t('late')) + '</span>' : ''); }, s: function (d) { return FLOW[d.type].indexOf(d.status); } },
    date: { l: 'c_date', v: function (d) { return '<span class="j">' + fd(d.date) + '</span>'; }, s: function (d) { return d.date || ''; } },
    dept: { l: 'c_dept', v: function (d) { return d.dept ? esc(t(d.dept)) : '—'; }, s: function (d) { return d.dept || ''; } },
    side: { l: 'c_side', v: function (d) { return esc(t(d.side)); }, s: function (d) { return d.side; } },
    due: { l: 'c_due', v: function (d) { return '<span class="j' + (isLate(d) && d.type !== 'RFQ' ? ' t-bad' : '') + '">' + fd(d.due) + '</span>'; }, s: function (d) { return d.due || ''; } },
    quote: { l: 'c_quote', v: function (d) { return d.quote === 'Waiting' ? esc(t('quoteW')) : d.quote === 'Accepted' ? esc(t('quoteA')) : '—'; }, s: function (d) { return d.quote || ''; } },
    sup: { l: 'c_sup', v: function (d) { return d.sup ? '<a href="#/fornitore/' + encodeURIComponent(d.sup) + '" data-stop="1">' + esc(supName(d.sup)) + '</a>' : '—'; }, s: function (d) { return supName(d.sup).toUpperCase(); } },
    total: { l: 'c_total', num: 1, v: function (d) { return d.total ? '<span class="j">' + money(d.total, d.cur) + '</span>' : '<span class="mute">—</span>'; }, s: function (d) { return toEur(d.total || 0, d.cur); } },
    eur: { l: 'c_eur', num: 1, v: function (d) { return d.total ? '<span class="j">' + money(toEur(d.total, d.cur), 'EUR') + '</span>' : '<span class="mute">—</span>'; }, s: function (d) { return toEur(d.total || 0, d.cur); } },
    usd: { l: 'c_usd', num: 1, v: function (d) { return d.total ? '<span class="j">' + money(toUsd(d.total, d.cur), 'USD') + '</span>' : '<span class="mute">—</span>'; }, s: function (d) { return toUsd(d.total || 0, d.cur); } },
    limit: { l: 'c_limit', v: function (d) { return '<span class="j' + (isLate(d) ? ' t-bad' : '') + '">' + fd(d.limit) + '</span>'; }, s: function (d) { return d.limit || ''; } },
    deliverTo: { l: 'c_deliverTo', v: function (d) { return esc(d.deliverTo || '—'); }, s: function (d) { return d.deliverTo || ''; } },
    from: { l: 'c_from', v: function (d) { var p = d.from && d.from[0] && byId(d.from[0]); return p ? '<a class="j" data-stop="1" href="#/doc/' + p.id + '">' + esc(p.num) + '</a>' : '—'; }, s: function (d) { return (d.from && d.from[0]) || ''; } }
  };
  var TYPECOLS = {
    RQ: { all: ['num', 'orig', 'ship', 'desc', 'status', 'dept', 'side', 'date', 'due', 'quote'], def: ['num', 'ship', 'desc', 'status', 'dept', 'date', 'due', 'quote'] },
    RFQ: { all: ['num', 'orig', 'ship', 'desc', 'status', 'sup', 'total', 'eur', 'usd', 'dept', 'date', 'limit', 'due', 'from'], def: ['num', 'ship', 'desc', 'sup', 'status', 'total', 'eur', 'limit'] },
    PO: { all: ['num', 'orig', 'ship', 'desc', 'status', 'sup', 'total', 'eur', 'usd', 'dept', 'date', 'due', 'from'], def: ['num', 'ship', 'desc', 'sup', 'status', 'total', 'eur', 'date', 'due'] },
    DN: { all: ['num', 'orig', 'ship', 'desc', 'status', 'sup', 'deliverTo', 'side', 'dept', 'date', 'due', 'from'], def: ['num', 'ship', 'desc', 'sup', 'status', 'side', 'date', 'due', 'from'] }
  };
  function gridTable(rows, cols, sortKey, sortDir) {
    if (!rows.length) return '<div class="empty">' + esc(t('noResults')) + '</div>';
    var th = cols.map(function (c) {
      var C = COLS[c], lab = c === 'type' ? (P.lang === 'en' ? 'Type' : 'Tipo') : t(C.l);
      var arrow = sortKey === c ? (sortDir > 0 ? ' ▲' : ' ▼') : '';
      return '<th class="' + (C.num ? 'num' : '') + '">' + (sortKey !== null ? '<button data-act="sort" data-k="' + c + '">' + esc(lab) + arrow + '</button>' : esc(lab)) + '</th>';
    }).join('');
    var tr = rows.map(function (d) {
      return '<tr class="r" data-href="#/doc/' + d.id + '">' + cols.map(function (c) { return '<td class="' + (COLS[c].num ? 'num' : '') + '">' + COLS[c].v(d) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="tablebox"><table class="grid"><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>';
  }
  function matchQ(d, q) {
    if (!q) return true; q = q.toUpperCase();
    return (d.num + ' ' + (d.orig || '') + ' ' + d.desc + ' ' + supName(d.sup)).toUpperCase().indexOf(q) >= 0;
  }
  function pageDocs(q) {
    var tipo = q.tipo || 'RQ', nave = q.nave || '';
    var base = docs(function (d) { return !nave || d.ship === nave; });
    var tabs = ['RQ', 'RFQ', 'PO', 'DN'].map(function (ty) {
      var n = base.filter(function (d) { return d.type === ty; }).length;
      return '<a class="' + (ty === tipo ? 'on' : '') + '" href="#/docs' + qs({ tipo: ty, nave: nave }) + '">' + esc(t(ty)) + '<span class="j">' + n + '</span></a>';
    }).join('') + '<a href="#/modulo/fatture" class="">' + esc(t('FT')) + '<span class="j">—</span></a>';
    var rows = base.filter(function (d) {
      return d.type === tipo && (!q.stato || d.status === q.stato) && (!q.aperti || isOpen(d)) && (!q.late || isLate(d)) && matchQ(d, q.q);
    });
    var srt = P.sort[tipo] || { k: 'date', d: -1 };
    var sf = COLS[srt.k] ? COLS[srt.k].s : COLS.date.s;
    rows.sort(function (a, b) { var x = sf(a), y = sf(b); return x < y ? -srt.d : x > y ? srt.d : 0; });
    var cols = (P.cols[tipo] || TYPECOLS[tipo].def).filter(function (c) { return COLS[c]; });
    var stOpts = (FLOW[tipo].concat(Object.keys(ST[tipo]).filter(function (s) { return FLOW[tipo].indexOf(s) < 0; }))).map(function (s) {
      return '<option value="' + s + '"' + (q.stato === s ? ' selected' : '') + '>' + esc(ST[tipo][s][P.lang === 'en' ? 1 : 0]) + '</option>';
    }).join('');
    var shipOpts = DB.ships.map(function (s) { return '<option value="' + s.code + '"' + (nave === s.code ? ' selected' : '') + '>' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('');
    var menu = UI.colOpen ? '<div class="menu" role="menu">' + TYPECOLS[tipo].all.map(function (c) {
      return '<label><input type="checkbox" data-act="col" data-k="' + c + '"' + (cols.indexOf(c) >= 0 ? ' checked' : '') + '> ' + esc(t(COLS[c].l)) + '</label>';
    }).join('') + '</div>' : '';
    var filt = '<div class="filters">' +
      '<select data-filter="nave" aria-label="' + esc(t('c_ship')) + '"><option value="">' + esc(t('allShips')) + '</option>' + shipOpts + '</select>' +
      '<select data-filter="stato" aria-label="' + esc(t('c_status')) + '"><option value="">' + esc(t('allStatus')) + '</option>' + stOpts + '</select>' +
      '<input type="search" data-filter="q" value="' + esc(q.q || '') + '" placeholder="' + esc(t('filterTxt')) + '" aria-label="' + esc(t('filterTxt')) + '">' +
      '<label class="tog"><input type="checkbox" data-filter="aperti"' + (q.aperti ? ' checked' : '') + '> ' + esc(P.lang === 'en' ? 'Open only' : 'Solo aperti') + '</label>' +
      '<label class="tog"><input type="checkbox" data-filter="late"' + (q.late ? ' checked' : '') + '> ' + esc(t('onlyLate')) + '</label>' +
      '<span style="flex:1"></span><span class="mute j" style="font-size:12px">' + rows.length + ' ' + esc(t('rows')) + '</span>' +
      '<div class="colmenu"><button class="btn sm" data-act="colmenu" aria-expanded="' + UI.colOpen + '">' + esc(t('columns')) + '</button>' + menu + '</div></div>';
    var title = t(tipo) + (nave ? ' · ' + nave : '');
    return shell('docs', crumb([[t('fleet'), '#/'], nave ? [shipBy(nave).name, '#/nave/' + nave] : [t('allShips')], [t('purchasing')]]), title,
      '<nav class="tabs" aria-label="' + esc(t('purchasing')) + '">' + tabs + '</nav>' + filt + gridTable(rows, cols, srt.k, srt.d));
  }

  /* ---------- document ---------- */
  function pageDoc(id) {
    var d = byId(id); if (!d) return pageHome();
    var flow = FLOW[d.type], ci = flow.indexOf(d.status), neg = !!NEG[d.status];
    var pathHtml = '<aside aria-label="' + esc(t('path')) + '" style="flex:1 1 200px;max-width:230px"><div class="mute" style="font-size:12px;font-weight:700;letter-spacing:.06em;padding-bottom:10px">' + esc(t('path').toUpperCase()) + '</div><div class="path">' +
      flow.map(function (s, i) {
        var cls = neg ? (i === 0 ? 'done' : '') : i < ci ? 'done' : i === ci ? 'cur' : '';
        if (OPTIONAL[d.type] && OPTIONAL[d.type][s] && i > ci) cls += ' off';
        var sub = OPTIONAL[d.type] && OPTIONAL[d.type][s] ? t('optional') : '';
        var ev = (d.log || []).filter(function (e) { return e.to === s; }).pop();
        if (ev) sub = fd(ev.at);
        return '<div class="st ' + cls + '"><div class="dotc"><span class="dot"></span>' + (i < flow.length - 1 ? '<span class="ln"></span>' : '') + '</div><div class="tx"><span class="lb">' + esc(ST[d.type][s][P.lang === 'en' ? 1 : 0]) + '</span><span class="sb j">' + esc(sub) + '</span></div></div>';
      }).join('') +
      (neg ? '<div class="st cur"><div class="dotc"><span class="dot" style="background:var(--red);border-color:var(--red);box-shadow:0 0 0 4px var(--redSoft)"></span></div><div class="tx"><span class="lb" style="color:var(--red)">' + esc(stLabel(d)) + '</span></div></div>' : '') +
      '</div></aside>';

    var tot = d.total ? '<dt>' + esc(t('c_total')) + '</dt><dd class="j"><b>' + money(d.total, d.cur) + '</b> · ≈ ' + (d.cur === 'USD' ? money(toEur(d.total, d.cur), 'EUR') : money(toUsd(d.total, d.cur), 'USD')) + '</dd>' : '';
    var info = '<section class="card stack"><h2>' + esc(t('details')) + '</h2><dl class="kv">' +
      '<dt>' + esc(t('c_ship')) + '</dt><dd><a href="#/nave/' + d.ship + '">' + esc(shipBy(d.ship).name) + '</a></dd>' +
      (d.sup ? '<dt>' + esc(t('c_sup')) + '</dt><dd><a href="#/fornitore/' + encodeURIComponent(d.sup) + '">' + esc(supName(d.sup)) + '</a> <span class="j mute">' + esc(d.sup) + '</span></dd>' : '') + tot +
      '<dt>' + esc(t('c_date')) + '</dt><dd class="j">' + fd(d.date) + '</dd>' +
      '<dt>' + esc(d.type === 'RQ' ? t('c_due') : d.type === 'DN' ? t('sc_dn') : t('c_due')) + '</dt><dd class="j' + (isLate(d) && d.type !== 'RFQ' ? ' t-bad' : '') + '">' + fd(d.due) + '</dd>' +
      (d.limit ? '<dt>' + esc(t('c_limit')) + '</dt><dd class="j' + (isLate(d) ? ' t-bad' : '') + '">' + fd(d.limit) + '</dd>' : '') +
      (d.deliverTo ? '<dt>' + esc(t('c_deliverTo')) + '</dt><dd>' + esc(d.deliverTo) + '</dd>' : '') +
      (d.terms ? '<dt>' + esc(t('terms')) + '</dt><dd>' + esc(d.terms) + '</dd>' : '') +
      (d.offer ? '<dt>' + esc(t('extRef')) + '</dt><dd>' + esc(d.offer.ref || '—') + ' · ' + esc(t('validDays')) + ' ' + d.offer.days + '</dd>' : '') +
      '<dt>' + esc(t('c_orig')) + '</dt><dd class="j">' + esc(d.orig || '—') + '</dd></dl></section>';
    var lines = d.lines ? linesTable(d) : '<section class="card stack"><h2>' + esc(t('lines')) + '</h2><div class="note">' + esc(t('noLines')) + '</div></section>';

    // chain
    var rt = chainRoot(d), chainRows = [];
    (function walk(x, lv, seen) {
      if (!x || seen[x.id] || lv > 3) return; seen[x.id] = 1; chainRows.push({ d: x, lv: lv });
      children(x.id).sort(function (a, b) { return a.type === b.type ? (a.num < b.num ? -1 : 1) : FLOWORDER[a.type] - FLOWORDER[b.type]; }).forEach(function (c) { walk(c, lv + 1, seen); });
    })(rt, 0, {});
    var chainHtml = chainRows.length > 1 ? chainRows.map(function (r) {
      var x = r.d;
      return '<a href="#/doc/' + x.id + '" class="lv' + r.lv + (x.id === d.id ? ' me' : '') + '"><span class="j" style="font-size:13px;color:var(--teal);font-weight:600">' + esc(x.num) + '</span><span style="font-size:12px" class="mute">' + esc(t(x.type + '1')) + (x.sup ? ' · ' + esc(supName(x.sup)) : '') + ' · ' + esc(stLabel(x)) + (x.total ? ' · ' + money(x.total, x.cur) : '') + '</span></a>';
    }).join('') : '<div class="mute" style="font-size:13px">' + esc(t('noChain')) + '</div>';

    // next actions
    var acts = (ACT[d.type] && ACT[d.type][d.status]) || [];
    var nextHtml;
    if (!acts.length) nextHtml = '<section class="card"><div class="mute">' + esc(t('closed')) + '</div></section>';
    else {
      var pri = acts.filter(function (a) { return !a.sec; }), sec = acts.filter(function (a) { return a.sec; });
      nextHtml = '<section class="next"><div class="k">' + esc(t('next').toUpperCase()) + '</div><div class="t">' + esc(pri[0].l[P.lang === 'en' ? 1 : 0]) + '</div>' +
        (d.type === 'PO' && d.status === 'bozza' ? '<div style="font-size:12px">' + esc(t('impactTxt')) + '</div>' : '') +
        pri.map(function (a) {
          if (a.ship && P.seat !== 'ship') return '<div class="note" style="background:var(--panel)"><b>' + esc(t('onlyShipAct')) + '</b><br>' + esc(d.type === 'DN' ? t('onlyShip') : a.l[P.lang === 'en' ? 1 : 0]) + '</div><button class="btn" data-act="seat">' + esc(t('toShipSeat')) + '</button>';
          return '<button class="btn pri" data-act="adv" data-to="' + a.to + '" data-form="' + (a.form || '') + '">' + esc(a.l[P.lang === 'en' ? 1 : 0]) + '</button>';
        }).join('') +
        '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">' + sec.map(function (a) { return '<button class="btn sm" data-act="adv" data-to="' + a.to + '">' + esc(a.l[P.lang === 'en' ? 1 : 0]) + '</button>'; }).join('') +
        (CANCEL[d.type] ? '<button class="btn link" data-act="cancel">' + esc(t('cancel')) + '</button>' : '') + '</div></section>';
    }
    var log = (d.log || []).slice().reverse().map(function (e) { return '<div><span class="j">' + fd(e.at) + '</span><span>' + esc(e.txt) + '</span></div>'; }).join('') ||
      '<div><span class="j">' + fd(d.date) + '</span><span>' + esc(P.lang === 'en' ? 'Imported from InfoSHIP' : 'Importato da InfoSHIP') + ' · ' + esc(stLabel(d)) + '</span></div>';

    var head = '<div class="stack" style="gap:8px"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="j mute">' + esc(d.num) + '</span>' + chip(d) +
      (isLate(d) ? '<span class="chip c-bad">' + esc(t('late')) + '</span>' : '') +
      '<span class="chip c-neutral">' + esc(t('c_side')) + ': ' + esc(t(d.side)) + '</span>' + (d.dept ? '<span class="chip c-neutral">' + esc(t(d.dept)) + '</span>' : '') + '</div>' +
      '<h1 class="h1">' + esc(d.desc || '—') + '</h1></div>';
    var body = '<div class="row">' + pathHtml +
      '<div class="grow stack" style="gap:14px">' + head + info + lines + '</div>' +
      '<aside class="side">' + nextHtml + '<section class="card stack"><h2>' + esc(t('chain')) + '</h2><div class="chain">' + chainHtml + '</div></section>' +
      '<section class="card stack"><h2>' + esc(t('history')) + '</h2><div class="log">' + log + '</div></section></aside></div>';
    return shell('doc', crumb([[t('fleet'), '#/'], [shipBy(d.ship).name, '#/nave/' + d.ship], [t(d.type), '#/docs' + qs({ tipo: d.type, nave: d.ship })]]), t(d.type + '1') + ' ' + d.num, body);
  }
  var FLOWORDER = { RQ: 0, RFQ: 1, PO: 2, DN: 3, FT: 4 };

  function advance(d, to, extra) {
    var from = d.status; d.status = to;
    d.log = d.log || [];
    if (!d.log.length) d.log.push({ at: d.date, to: from, txt: (P.lang === 'en' ? 'Imported from InfoSHIP · ' : 'Importato da InfoSHIP · ') + ST[d.type][from][P.lang === 'en' ? 1 : 0] });
    d.log.push({ at: TODAY, to: to, txt: ST[d.type][to][P.lang === 'en' ? 1 : 0] + (extra ? ' · ' + extra : '') });
    if (d.type === 'DN' && to === 'ricevuta') d.side = 'office';
    save(); render(); toast(t('done') + ': ' + ST[d.type][to][P.lang === 'en' ? 1 : 0]);
  }

  /* ---------- modal ---------- */
  function modal(title, fields, onOk) {
    var bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = '<form class="modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><h3>' + esc(title) + '</h3>' +
      fields.map(function (f) {
        var inp = f.type === 'select' ? '<select name="' + f.n + '">' + f.opts.map(function (o) { return '<option' + (o === f.v ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>'
          : f.type === 'area' ? '<textarea name="' + f.n + '" rows="3"' + (f.req ? ' required' : '') + '></textarea>'
          : '<input name="' + f.n + '" value="' + esc(f.v || '') + '"' + (f.req ? ' required' : '') + (f.num ? ' inputmode="decimal"' : '') + '>';
        return '<label>' + esc(f.l) + inp + '</label>';
      }).join('') +
      '<div class="acts"><button type="button" class="btn" data-x="1">' + esc(t('close')) + '</button><button class="btn pri" type="submit">' + esc(t('confirm')) + '</button></div></form>';
    document.body.appendChild(bg);
    var form = bg.querySelector('form'); var first = form.querySelector('input,textarea,select'); if (first) first.focus();
    function close() { bg.remove(); }
    bg.addEventListener('click', function (e) { if (e.target === bg || e.target.getAttribute('data-x')) close(); });
    bg.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = {}; fields.forEach(function (f) { v[f.n] = form.elements[f.n].value.trim(); }); close(); onOk(v); });
  }
  function parseNum(s) { s = String(s || '').replace(/\s/g, ''); if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.'); var n = parseFloat(s); return isNaN(n) ? 0 : n; }

  /* ---------- budget ---------- */
  function pageBudget(q) {
    var ship = q.nave && DB.budgets[q.nave] ? q.nave : 'PEP';
    var tabs = DB.ships.filter(function (s) { return DB.budgets[s.code]; }).map(function (s) { return '<a class="' + (s.code === ship ? 'on' : '') + '" href="#/budget' + qs({ nave: s.code }) + '">' + s.code + ' · ' + esc(s.name) + '</a>'; }).join('');
    var B = budgetAgg(ship), A = acctMap(), pr = yearFrac();
    var kids = {}; DB.accounts.forEach(function (a) { var p = a.parent || '_'; (kids[p] = kids[p] || []).push(a); });
    function nz(p) { var v = B[p]; return v && (v.b || v.o || v.d); }
    var rows = [];
    (function walk(p, lv) {
      (kids[p] || []).forEach(function (a) {
        if (!UI.showZero && !nz(a.path)) return;
        rows.push({ a: a, lv: lv });
        var key = ship + a.path, open = UI.expanded[key] != null ? UI.expanded[key] : (lv === 0);
        if (!a.post && open) walk(a.path, lv + 1);
      });
    })('_', 0);
    var tr = rows.map(function (r) {
      var a = r.a, v = B[a.path], rem = v.b - v.o - v.d, use = v.b ? (v.o + v.d) / v.b : null;
      var key = ship + a.path, open = UI.expanded[key] != null ? UI.expanded[key] : (r.lv === 0);
      var tog = !a.post && (kids[a.path] || []).length ? '<button data-act="bexp" data-k="' + esc(key) + '" data-o="' + (open ? 1 : 0) + '" aria-label="' + (open ? '−' : '+') + '">' + (open ? '▾' : '▸') + '</button>' : '<span style="display:inline-block;width:14px"></span>';
      var cls = a.cc ? 'cc' : !a.post ? 'g' : '';
      var w = v.b ? Math.min(100, (v.o + v.d) / v.b * 100) : (v.o + v.d > 0 ? 100 : 0);
      return '<tr class="' + cls + '"><td style="padding-left:' + (12 + r.lv * 18) + 'px">' + tog + '<span class="j mute" style="font-size:12px;margin-right:8px">' + esc(a.code) + '</span>' + esc(a.desc) + '</td>' +
        '<td class="num j">' + nf(v.b, 0) + '</td><td class="num j">' + nf(v.o, 0) + '</td><td class="num j">' + nf(v.d, 0) + '</td>' +
        '<td class="num j ' + (rem < 0 ? 't-bad' : '') + '">' + nf(rem, 0) + '</td>' +
        '<td style="min-width:150px"><div class="bar" title="' + (use == null ? '' : Math.round(use * 100) + '%') + '"><i style="width:' + w + '%;background:' + (use == null || use > pr ? 'var(--red)' : 'var(--bar2)') + '"></i></div><span class="j mute" style="font-size:11px">' + (use == null ? (v.o + v.d > 0 ? (P.lang === 'en' ? 'no budget' : 'senza budget') : '') : Math.round(use * 100) + '%') + '</span></td>' +
        '<td class="num j mute">' + nf(v.b * pr, 0) + '</td></tr>';
    }).join('');
    var tot = { b: 0, o: 0, d: 0 }; (kids['_'] || []).forEach(function (a) { var v = B[a.path]; tot.b += v.b; tot.o += v.o; tot.d += v.d; });
    var head = '<div class="kpis">' + kpiBox(t('b_budget'), nf(tot.b, 0), '€ · /12 = ' + nf(tot.b / 12, 0) + ' €/' + (P.lang === 'en' ? 'month' : 'mese'), 'mute', '#/budget' + qs({ nave: ship })) +
      kpiBox(t('b_ord'), nf(tot.o, 0), '€', 'mute', '#/docs' + qs({ tipo: 'PO', nave: ship, aperti: 1 })) +
      kpiBox(t('b_del'), nf(tot.d, 0), '€', 'mute', '#/docs' + qs({ tipo: 'DN', nave: ship })) +
      kpiBox(t('b_rem'), nf(tot.b - tot.o - tot.d, 0), t('b_pr') + ' ' + Math.round(pr * 100) + '%', tot.b - tot.o - tot.d < 0 ? 'bad' : 'ok', '#/budget' + qs({ nave: ship })) + '</div>';
    var body = '<nav class="tabs">' + tabs + '</nav>' + head +
      '<div class="filters"><span class="legend"><span><i style="background:var(--bar2)"></i>' + esc(P.lang === 'en' ? 'within pro rata' : 'entro il pro rata') + '</span><span><i style="background:var(--red)"></i>' + esc(P.lang === 'en' ? 'over pro rata or no budget' : 'oltre il pro rata o senza budget') + '</span></span><span style="flex:1"></span>' +
      '<label class="tog"><input type="checkbox" data-act="zero"' + (UI.showZero ? ' checked' : '') + '> ' + esc(t('showZero')) + '</label></div>' +
      '<div class="tablebox btree"><table class="grid"><thead><tr><th>' + esc(t('acct')) + '</th><th class="num">' + esc(t('b_budget')) + '</th><th class="num">' + esc(t('b_ord')) + '</th><th class="num">' + esc(t('b_del')) + '</th><th class="num">' + esc(t('b_rem')) + '</th><th>' + esc(t('b_use')) + '</th><th class="num">' + esc(t('b_pr')) + '</th></tr></thead><tbody>' + tr + '</tbody></table></div>' +
      '<div class="note">' + esc(t('b_note')) + '</div>';
    return shell('budget', crumb([[t('fleet'), '#/'], [shipBy(ship).name, '#/nave/' + ship]]), t('budget') + ' 2026 · ' + ship, body);
  }

  /* ---------- suppliers ---------- */
  function supStats(id) {
    var ds = docs(function (d) { return d.sup === id; });
    var rfq = ds.filter(function (d) { return d.type === 'RFQ'; }), po = ds.filter(function (d) { return d.type === 'PO' && d.status !== 'annullato'; });
    return {
      ds: ds, rfq: rfq.length, ref: rfq.filter(function (d) { return d.status === 'rifiutata'; }).length, po: po.length,
      ord: po.reduce(function (s, d) { return s + toEur(d.total || 0, d.cur); }, 0),
      last: ds.reduce(function (m, d) { return d.date > m ? d.date : m; }, '')
    };
  }
  function pageSuppliers(q) {
    var rows = DB.suppliers.filter(function (s) { return !q.q || s.name.toUpperCase().indexOf(q.q.toUpperCase()) >= 0 || s.id.toUpperCase().indexOf(q.q.toUpperCase()) >= 0; })
      .map(function (s) { return { s: s, st: supStats(s.id) }; }).sort(function (a, b) { return b.st.ord - a.st.ord; });
    var tr = rows.map(function (r) {
      return '<tr class="r" data-href="#/fornitore/' + encodeURIComponent(r.s.id) + '"><td class="j mute" style="font-size:12px">' + esc(r.s.id) + '</td><td><b>' + esc(r.s.name) + '</b></td><td class="j">' + r.s.cur + '</td>' +
        '<td class="num j">' + r.st.rfq + '</td><td class="num j">' + r.st.po + '</td><td class="num j">' + nf(r.st.ord, 0) + '</td><td class="num j">' + (r.st.rfq ? Math.round(r.st.ref / r.st.rfq * 100) + '%' : '—') + '</td><td class="j">' + fd(r.st.last) + '</td></tr>';
    }).join('');
    var body = '<div class="filters"><input type="search" data-filter="q" value="' + esc(q.q || '') + '" placeholder="' + esc(t('filterTxt')) + '" aria-label="' + esc(t('filterTxt')) + '"><span style="flex:1"></span><span class="mute j" style="font-size:12px">' + rows.length + ' ' + esc(t('rows')) + '</span></div>' +
      '<div class="tablebox"><table class="grid"><thead><tr><th>Cod.</th><th>' + esc(t('c_sup')) + '</th><th>' + esc(t('currency')) + '</th><th class="num">' + esc(t('s_rfq')) + '</th><th class="num">' + esc(t('s_po')) + '</th><th class="num">' + esc(t('s_ord')) + '</th><th class="num">' + esc(t('s_ref')) + '</th><th>' + esc(t('s_last')) + '</th></tr></thead><tbody>' + tr + '</tbody></table></div>';
    return shell('fornitori', crumb([[t('fleet'), '#/']]), t('suppliers'), body);
  }
  function pageSupplier(id) {
    var s = supById(id); if (!s) return pageSuppliers({});
    var st = supStats(id);
    var rows = st.ds.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var body = '<div class="kpis">' + kpiBox(t('s_rfq'), st.rfq, st.ref + ' ' + (P.lang === 'en' ? 'refused' : 'rifiutate'), st.ref ? 'warn' : 'mute', '#/docs' + qs({ tipo: 'RFQ', q: s.name })) +
      kpiBox(t('s_po'), st.po, nf(st.ord, 0) + ' €', 'mute', '#/docs' + qs({ tipo: 'PO', q: s.name })) +
      kpiBox(t('s_cur'), s.cur, s.id, 'mute', '#/fornitore/' + encodeURIComponent(id)) +
      kpiBox(t('poOpen'), rows.filter(function (d) { return d.type === 'PO' && isOpen(d); }).length, rows.filter(function (d) { return d.type === 'PO' && isLate(d); }).length + ' ' + t('late'), 'bad', '#/docs' + qs({ tipo: 'PO', q: s.name, aperti: 1 })) + '</div>' +
      '<h2 style="margin:0;font-size:15px">' + esc(t('s_hist')) + '</h2>' + gridTable(rows, ['num', 'type', 'ship', 'desc', 'status', 'total', 'date'], null, null);
    return shell('fornitori', crumb([[t('fleet'), '#/'], [t('suppliers'), '#/fornitori']]), s.name, body);
  }

  /* ---------- due dates ---------- */
  function pageDue(q) {
    var nave = q.nave || '';
    var items = docs(function (d) { return (!nave || d.ship === nave) && isOpen(d) && lateDate(d) && !(d.type === 'RQ' && d.status === 'quotata'); }).map(function (d) {
      return { d: d, at: lateDate(d), k: d.type === 'RFQ' ? 'sc_rfq' : d.type === 'PO' ? 'sc_po' : d.type === 'DN' ? 'sc_dn' : 'sc_rq' };
    }).sort(function (a, b) { return a.at < b.at ? -1 : 1; });
    var in14 = new Date(Date.parse(TODAY) + 14 * 864e5).toISOString().slice(0, 10);
    var groups = [['sc_over', items.filter(function (i) { return i.at < TODAY; })], ['sc_next', items.filter(function (i) { return i.at >= TODAY && i.at <= in14; })], ['sc_later', items.filter(function (i) { return i.at > in14; })]];
    var shipOpts = DB.ships.map(function (s) { return '<option value="' + s.code + '"' + (nave === s.code ? ' selected' : '') + '>' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('');
    var body = '<div class="filters"><select data-filter="nave" aria-label="' + esc(t('c_ship')) + '"><option value="">' + esc(t('allShips')) + '</option>' + shipOpts + '</select></div>' +
      groups.map(function (g) {
        return '<section class="stack"><h2 style="margin:0;font-size:15px" class="' + (g[0] === 'sc_over' ? 't-bad' : '') + '">' + esc(t(g[0])) + ' <span class="j mute">' + g[1].length + '</span></h2>' +
          (g[1].length ? '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('c_date')) + '</th><th>' + (P.lang === 'en' ? 'Due' : 'Scadenza') + '</th><th>' + esc(t('c_num')) + '</th><th>' + esc(t('c_ship')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(t('c_sup')) + '</th><th>' + esc(t('c_status')) + '</th></tr></thead><tbody>' +
            g[1].slice(0, 200).map(function (i) {
              var d = i.d;
              return '<tr class="r" data-href="#/doc/' + d.id + '"><td class="j ' + (i.at < TODAY ? 't-bad' : '') + '">' + fd(i.at) + '</td><td>' + esc(t(i.k)) + '</td><td>' + COLS.num.v(d) + '</td><td>' + COLS.ship.v(d) + '</td><td>' + esc(d.desc) + '</td><td>' + esc(supName(d.sup) || '—') + '</td><td>' + chip(d) + '</td></tr>';
            }).join('') + '</tbody></table></div>' : '<div class="empty">' + esc(t('noResults')) + '</div>') + '</section>';
      }).join('') + '<div class="note">' + esc(t('sc_note')) + '</div>';
    return shell('scadenze', crumb([[t('fleet'), '#/']]), t('sc_title') + (nave ? ' · ' + nave : ''), body);
  }

  function pageSoon(name) {
    return shell(name, crumb([[t('fleet'), '#/']]), name === 'fatture' ? t('FT') : t({ pms: 'pms', magazzino: 'stores', certificati: 'certs' }[name] || name),
      '<div class="card stack"><h2>' + esc(t('soon')) + '</h2><p class="mute" style="margin:0">' + esc(t('soonTxt')) + '</p></div>');
  }
  function pageData() {
    var n = DB.docs.length;
    var body = '<section class="card stack"><h2>' + esc(t('d_src')) + '</h2><p style="margin:0">' + esc(DB.meta.source) + ' · <span class="j">' + n + '</span> ' + esc(P.lang === 'en' ? 'documents' : 'documenti') + ', <span class="j">' + DB.suppliers.length + '</span> ' + esc(t('suppliers').toLowerCase()) + ', budget PEP · MDT · MLG 2026.</p><p class="mute" style="margin:0">' + esc(t('d_txt')) + '</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="export">' + esc(t('d_export')) + '</button><label class="btn">' + esc(t('d_import')) + '<input type="file" accept="application/json" data-act="import" hidden></label><button class="btn link" data-act="reset">' + esc(t('d_reset')) + '</button></div></section>';
    return shell('dati', crumb([[t('fleet'), '#/']]), t('d_title'), body);
  }


  /* ---------- lines, receipts, stores ---------- */
  function disc(l) { return (1 - (l.d1 || 0) / 100) * (1 - (l.d2 || 0) / 100); }
  function unitEur(po, l) { var u = l.price * disc(l); return po.cur === 'USD' ? u / (po.fx || fx()) : u; }
  function itemById(id) { var a = DB.items || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  function lineDesc(l) { return '<div>' + esc(l.desc) + '</div>' + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') + (l.impa ? '<div class="mute j" style="font-size:11px">IMPA ' + esc(l.impa) + '</div>' : ''); }
  function poReceived(po) {
    var m = {};
    docs(function (x) { return x.type === 'DN' && x.from && x.from[0] === po.id && x.lines; }).forEach(function (dn) {
      dn.lines.forEach(function (l) { if (l.recv != null) m[l.src] = (m[l.src] || 0) + l.recv; });
    });
    return m;
  }
  function linesTable(d) {
    var head, rows, foot = '';
    if (d.type === 'DN') {
      head = ['l_row', 'l_code', 'c_desc', 'l_uom', 'l_ship', 'l_recv'];
      rows = d.lines.map(function (l) {
        var diff = l.recv != null && l.recv !== l.qty;
        return '<tr><td class="j">' + l.row + '</td><td class="j">' + esc(l.code) + '</td><td>' + (l.item ? '<a href="#/articolo/' + l.item + '?nave=' + d.ship + '">' + lineDesc(l) + '</a>' : lineDesc(l)) + '</td><td>' + esc(l.uom) + '</td><td class="num j">' + nf(l.qty) + '</td><td class="num j ' + (diff ? 't-bad' : l.recv != null ? 't-ok' : 'mute') + '">' + (l.recv == null ? '—' : nf(l.recv)) + '</td></tr>';
      });
      if (d.signed) foot = '<div class="note" style="display:flex;gap:8px;align-items:center"><span class="chip c-ok">' + esc(t('signed').split(' ')[0] + ' ✓') + '</span>' + esc(d.signed) + '</div>';
    } else {
      var rec = d.type === 'PO' ? poReceived(d) : null;
      var priced = d.type !== 'RQ';
      head = ['l_row', 'l_code', 'c_desc', 'l_uom', 'l_qty'].concat(priced ? ['l_price', 'l_disc', 'l_net'] : []).concat(rec ? ['l_recv', 'l_res'] : []).concat(['l_due']);
      rows = d.lines.map(function (l) {
        var r = rec ? (rec[l.row] || 0) : 0, res = l.qty - r;
        return '<tr><td class="j">' + l.row + '</td><td class="j">' + esc(l.code || '') + '</td><td>' + (l.item ? '<a href="#/articolo/' + l.item + '?nave=' + d.ship + '">' + lineDesc(l) + '</a>' : lineDesc(l)) + '</td><td>' + esc(l.uom) + '</td>' +
          '<td class="num j">' + nf(l.qty) + '</td>' + (priced ? '<td class="num j">' + (l.price != null ? nf(l.price) : '—') + '</td><td class="num j">' + (l.d1 ? nf(l.d1, 1) + '%' + (l.d2 ? '+' + nf(l.d2, 1) + '%' : '') : '') + '</td>' +
          '<td class="num j">' + (l.net != null ? money(l.net, d.cur) : '—') + '</td>' : '') +
          (rec ? '<td class="num j t-ok">' + (r ? nf(r) : '—') + '</td><td class="num j ' + (res > 0 ? 't-bad' : 'mute') + '">' + (res > 0 ? nf(res) : '0') + '</td>' : '') +
          '<td class="j">' + fd(l.due) + '</td></tr>';
      });
      if (d.type === 'PO') {
        var goods = d.lines.reduce(function (a, l) { return a + (l.net || 0); }, 0);
        var ch = (d.charges || []).map(function (c) { return '<dt>' + esc(t('ch_' + c.kind)) + (c.note ? ' <span class="mute">(' + esc(c.note) + ')</span>' : '') + '</dt><dd class="j" style="text-align:right">' + money(c.amount, d.cur) + '</dd>'; }).join('');
        foot = '<dl class="kv" style="max-width:420px;margin-left:auto"><dt>' + esc(t('goods')) + '</dt><dd class="j" style="text-align:right">' + money(goods, d.cur) + '</dd>' + ch +
          '<dt><b>' + esc(t('grand')) + '</b></dt><dd class="j" style="text-align:right"><b>' + money(d.total, d.cur) + '</b><br><span class="mute">≈ ' + (d.cur === 'USD' ? money(toEur(d.total, 'USD'), 'EUR') : money(toUsd(d.total, 'EUR'), 'USD')) + '</span></dd></dl>' +
          (d.mdsdoc ? '<div class="note">SOLAS II-1/3-5 · MD/SDoC ' + esc(P.lang === 'en' ? 'required for all items' : 'richiesti per tutti gli articoli') + '</div>' : '');
      }
    }
    return '<section class="card stack"><h2>' + esc(t('lines')) + ' <span class="j mute">' + d.lines.length + '</span></h2><div class="tablebox"><table class="grid"><thead><tr>' +
      head.map(function (h) { return '<th class="' + (/l_(qty|price|net|recv|res|ship|disc)/.test(h) ? 'num' : '') + '">' + esc(t(h)) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' + foot + '</section>';
  }
  function receiveModal(dn) {
    var bg = document.createElement('div'); bg.className = 'modal-bg';
    var rows = (dn.lines || []).map(function (l, i) {
      return '<tr><td class="j">' + l.row + '</td><td>' + esc(l.desc) + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') + '</td><td class="num j">' + nf(l.qty) + ' ' + esc(l.uom) + '</td><td><input name="q' + i + '" value="' + nf(l.qty) + '" inputmode="decimal" style="width:90px;text-align:right" aria-label="' + esc(t('l_recv')) + ' ' + l.row + '"></td></tr>';
    }).join('');
    bg.innerHTML = '<form class="modal" style="width:min(820px,100%)" role="dialog" aria-modal="true" aria-label="' + esc(t('rcvTitle')) + '"><h3>' + esc(t('rcvTitle')) + ' · ' + esc(dn.num) + '</h3>' +
      (rows ? '<p class="mute" style="margin:0;font-size:13px">' + esc(t('rcvTxt')) + '</p><div class="tablebox" style="max-height:45vh;overflow:auto"><table class="grid" style="min-width:560px"><thead><tr><th>' + esc(t('l_row')) + '</th><th>' + esc(t('c_desc')) + '</th><th class="num">' + esc(t('l_ship')) + '</th><th>' + esc(t('l_recv')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '') +
      '<label style="flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" name="signed" required> ' + esc(t('signed')) + '</label>' +
      '<label>' + esc(t('signedFile')) + '<input type="file" name="file" accept="image/*,application/pdf"></label>' +
      '<div class="mute" style="font-size:12px">' + esc(t('signedReq')) + '</div>' +
      '<div class="acts"><button type="button" class="btn" data-x="1">' + esc(t('close')) + '</button><button class="btn pri" type="submit">' + esc(t('confirm')) + '</button></div></form>';
    document.body.appendChild(bg);
    var form = bg.querySelector('form');
    function close() { bg.remove(); }
    bg.addEventListener('click', function (e) { if (e.target === bg || e.target.getAttribute('data-x')) close(); });
    bg.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var po = dn.from && byId(dn.from[0]), f = form.elements.file.files[0];
      DB.moves = DB.moves || [];
      (dn.lines || []).forEach(function (l, i) {
        var q = Math.max(0, parseNum(form.elements['q' + i].value)); l.recv = q;
        if (q > 0 && l.item) {
          var pl = po && po.lines ? po.lines.filter(function (x) { return x.row === l.src; })[0] : null;
          DB.moves.push({ id: 'M-' + dn.id + '-' + l.row + '-' + Date.now(), ship: dn.ship, item: l.item, date: TODAY, qty: q, kind: 'carico', doc: dn.id, row: l.row, cost: pl ? Math.round(unitEur(po, pl) * 10000) / 10000 : 0 });
        }
      });
      dn.signed = (P.lang === 'en' ? 'Signed DN' : 'DN firmata') + (f ? ': ' + f.name : '') + ' · ' + fd(TODAY);
      dn.side = 'office';
      close();
      advance(dn, 'ricevuta', (dn.lines || []).length ? (dn.lines.length + ' ' + t('rows')) : '');
    });
  }
  function stockOf(ship) {
    var m = {};
    function g(id) { return m[id] || (m[id] = { id: id, qty: 0, val: 0, inArr: 0, last: null, moves: [] }); }
    (DB.moves || []).filter(function (x) { return x.ship === ship; }).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }).forEach(function (mv) {
      var s = g(mv.item), avg = s.qty > 0 ? s.val / s.qty : (mv.cost || 0);
      if (mv.qty > 0 && mv.kind === 'carico') { s.val += mv.qty * (mv.cost || 0); } else { s.val += mv.qty * avg; }
      s.qty += mv.qty; if (s.qty <= 0.0001) { s.qty = Math.max(0, s.qty); if (s.qty === 0) s.val = 0; }
      s.moves.push({ mv: mv, bal: s.qty });
    });
    docs(function (x) { return x.ship === ship && x.type === 'DN' && isOpen(x) && x.lines; }).forEach(function (dn) { dn.lines.forEach(function (l) { if (l.item) g(l.item).inArr += l.qty; }); });
    docs(function (x) { return x.ship === ship && x.type === 'PO' && x.lines && x.status !== 'annullato'; }).forEach(function (po) {
      var hasDn = docs(function (x) { return x.type === 'DN' && x.from && x.from[0] === po.id; }).length;
      po.lines.forEach(function (l) {
        if (!l.item) return; var s = g(l.item);
        if (!hasDn && isOpenPO(po)) s.inArr += l.qty;
        var u = unitEur(po, l);
        if (!s.last || po.date >= s.last.date) s.last = { date: po.date, price: u, sup: po.sup };
      });
    });
    return m;
  }
  function isOpenPO(po) { return po.status === 'approvato' || po.status === 'inviato' || po.status === 'confermato' || po.status === 'finalizzato'; }
  function minOf(ship, id) { return (DB.stock || {})[ship + '|' + id] || 0; }
  function pageStores(q) {
    var ship = q.nave || 'PEP', tab = q.tab || 'art', S = stockOf(ship), items = (DB.items || []).filter(function (it) { return S[it.id]; });
    var shipTabs = DB.ships.map(function (s) { return '<a class="' + (s.code === ship ? 'on' : '') + '" href="#/magazzino' + qs({ nave: s.code, tab: tab }) + '">' + s.code + '</a>'; }).join('');
    var tot = 0, under = 0, inArrV = 0;
    items.forEach(function (it) { var s = S[it.id]; tot += s.val; if (minOf(ship, it.id) > 0 && s.qty < minOf(ship, it.id)) under++; if (s.last) inArrV += s.inArr * s.last.price; });
    var allLines = 0, gen = 0; docs(function (d) { return d.ship === ship && d.type === 'PO' && d.lines; }).forEach(function (d) { d.lines.forEach(function (l) { allLines++; if (l.code === 'GI0001') gen++; }); });
    var kp = '<div class="kpis">' + kpiBox(t('st_value'), nf(tot, 0), '€ · ' + (P.lang === 'en' ? 'weighted average cost' : 'costo medio ponderato'), 'mute', '#/magazzino' + qs({ nave: ship })) +
      kpiBox(t('st_incoming'), nf(inArrV, 0), '€ · ' + (P.lang === 'en' ? 'ordered or shipped, not on board' : 'ordinato o spedito, non a bordo'), 'mute', '#/docs' + qs({ tipo: 'DN', nave: ship, aperti: 1 })) +
      kpiBox(t('st_under'), under, under ? t('st_reorder') : '—', under ? 'bad' : 'mute', '#/magazzino' + qs({ nave: ship, under: 1 })) +
      kpiBox(t('st_nItems'), items.length, (allLines ? Math.round(gen / allLines * 100) : 0) + '% ' + t('st_genShare'), gen ? 'warn' : 'mute', '#/magazzino' + qs({ nave: ship, gen: 1 })) + '</div>';
    var tabs = '<nav class="tabs">' + [['art', 'st_items'], ['mov', 'st_moves'], ['doc', 'st_docs']].map(function (x) { return '<a class="' + (tab === x[0] ? 'on' : '') + '" href="#/magazzino' + qs({ nave: ship, tab: x[0] }) + '">' + esc(t(x[1])) + '</a>'; }).join('') + '</nav>';
    var body;
    if (!items.length && tab === 'art') body = '<div class="empty">' + esc(P.lang === 'en' ? 'No items for this vessel yet. Stores fill up when orders with lines arrive and the vessel confirms the DN.' : 'Nessun articolo per questa nave. Il magazzino si riempie quando arrivano ordini con righe e la nave conferma la DN.') + '</div>';
    else if (tab === 'mov') {
      var mv = (DB.moves || []).filter(function (x) { return x.ship === ship; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      body = movesTable(mv, true);
    } else if (tab === 'doc') {
      body = gridTable(docs(function (d) { return d.ship === ship && (d.type === 'CS' || d.type === 'INV' || (d.type === 'DN' && d.status === 'ricevuta')); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }), ['num', 'type', 'desc', 'status', 'date'], null, null);
    } else {
      var rows = items.filter(function (it) {
        var s = S[it.id], mn = minOf(ship, it.id);
        return (!q.q || ((it.impa || '') + ' ' + it.code + ' ' + it.desc).toUpperCase().indexOf(q.q.toUpperCase()) >= 0) && (!q.under || (mn > 0 && s.qty < mn)) && (!q.stock || s.qty > 0) && (!q.gen || it.generic);
      }).sort(function (a, b) { return S[b.id].val - S[a.id].val || (a.desc < b.desc ? -1 : 1); });
      body = '<div class="filters"><input type="search" data-filter="q" value="' + esc(q.q || '') + '" placeholder="' + esc(t('filterTxt')) + '" aria-label="' + esc(t('filterTxt')) + '">' +
        '<label class="tog"><input type="checkbox" data-filter="stock"' + (q.stock ? ' checked' : '') + '> ' + esc(t('st_withStock')) + '</label>' +
        '<label class="tog"><input type="checkbox" data-filter="under"' + (q.under ? ' checked' : '') + '> ' + esc(t('st_under')) + '</label>' +
        '<label class="tog"><input type="checkbox" data-filter="gen"' + (q.gen ? ' checked' : '') + '> ' + esc(t('st_generic')) + '</label>' +
        '<span style="flex:1"></span><span class="mute j" style="font-size:12px">' + rows.length + ' ' + esc(t('rows')) + '</span>' +
        '<button class="btn" data-act="reorder" data-ship="' + ship + '"' + (under ? '' : ' disabled') + '>' + esc(t('st_reorder')) + '</button></div>' +
        '<div class="tablebox"><table class="grid"><thead><tr><th>IMPA / ' + esc(t('l_code')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(t('l_uom')) + '</th><th class="num">' + esc(t('st_stock')) + '</th><th class="num">' + esc(t('st_incoming')) + '</th><th class="num">' + esc(t('st_min')) + '</th><th class="num">' + esc(t('st_avg')) + '</th><th class="num">' + esc(t('st_val')) + '</th><th>' + esc(t('st_lastSup')) + '</th></tr></thead><tbody>' +
        rows.map(function (it) {
          var s = S[it.id], mn = minOf(ship, it.id), low = mn > 0 && s.qty < mn;
          return '<tr class="r" data-href="#/articolo/' + it.id + '?nave=' + ship + '"><td class="j">' + (it.impa ? esc(it.impa) : '<span class="chip c-warn">GI0001</span>') + '</td><td>' + esc(it.desc) + '</td><td>' + esc(it.uom) + '</td>' +
            '<td class="num j ' + (low ? 't-bad' : '') + '"><b>' + nf(s.qty) + '</b></td><td class="num j">' + (s.inArr ? nf(s.inArr) : '—') + '</td><td class="num j">' + (mn ? nf(mn) : '—') + '</td>' +
            '<td class="num j">' + (s.qty ? nf(s.val / s.qty) : (s.last ? '<span class="mute">' + nf(s.last.price) + '</span>' : '—')) + '</td><td class="num j">' + (s.val ? nf(s.val) : '—') + '</td><td>' + esc(s.last ? supName(s.last.sup) : '—') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    return shell('magazzino', crumb([[t('fleet'), '#/'], [shipBy(ship).name, '#/nave/' + ship]]), t('stores') + ' · ' + ship,
      '<nav class="tabs">' + shipTabs + '</nav>' + kp + tabs + body + '<div class="note">' + esc(t('st_note')) + '</div>');
  }
  function movesTable(mv, withItem) {
    if (!mv.length) return '<div class="empty">' + esc(t('st_none')) + '</div>';
    return '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('c_date')) + '</th>' + (withItem ? '<th>' + esc(t('st_items')) + '</th>' : '') + '<th>' + esc(t('st_cause')) + '</th><th>' + esc(t('c_num')) + '</th><th class="num">' + esc(t('l_qty')) + '</th>' + (withItem ? '' : '<th class="num">' + esc(t('st_progr')) + '</th>') + '<th class="num">' + esc(t('st_avg')) + '</th></tr></thead><tbody>' +
      mv.map(function (x) {
        var m = x.mv || x, d = byId(m.doc), it = itemById(m.item);
        return '<tr class="r" data-href="#/doc/' + m.doc + '"><td class="j">' + fd(m.date) + '</td>' + (withItem ? '<td>' + esc(it ? it.desc : m.item) + '</td>' : '') + '<td>' + esc(t('k_' + m.kind)) + (m.note ? ' · <span class="mute">' + esc(m.note) + '</span>' : '') + '</td><td class="j">' + esc(d ? d.num : m.doc) + '</td>' +
          '<td class="num j ' + (m.qty < 0 ? 't-bad' : 't-ok') + '">' + (m.qty > 0 ? '+' : '') + nf(m.qty) + '</td>' + (withItem ? '' : '<td class="num j"><b>' + nf(x.bal) + '</b></td>') + '<td class="num j">' + (m.cost ? nf(m.cost) : '—') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function pageItem(id, q) {
    var it = itemById(id); if (!it) return pageStores(q);
    var ship = q.nave || 'PEP', S = stockOf(ship), s = S[id] || { qty: 0, val: 0, inArr: 0, moves: [] }, mn = minOf(ship, id);
    var prices = [];
    docs(function (d) { return d.type === 'PO' && d.lines; }).forEach(function (po) { po.lines.forEach(function (l) { if (l.item === id) prices.push({ po: po, l: l }); }); });
    prices.sort(function (a, b) { return a.po.date < b.po.date ? 1 : -1; });
    var acts = P.seat === 'ship'
      ? '<button class="btn pri" data-act="consume" data-item="' + id + '" data-ship="' + ship + '"' + (s.qty > 0 ? '' : ' disabled') + '>' + esc(t('st_consume')) + '</button><button class="btn" data-act="count" data-item="' + id + '" data-ship="' + ship + '">' + esc(t('st_count')) + '</button>'
      : '<span class="mute" style="font-size:13px">' + esc(t('onlyShipAct')) + ': ' + esc(t('st_consume')).toLowerCase() + ', ' + esc(t('st_count')).toLowerCase() + '</span><button class="btn" data-act="seat">' + esc(t('toShipSeat')) + '</button>';
    var body = '<div class="stack" style="gap:6px"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' + (it.impa ? '<span class="chip c-info j">IMPA ' + esc(it.impa) + '</span>' : '<span class="chip c-warn">GI0001 · ' + esc(P.lang === 'en' ? 'generic code' : 'codice generico') + '</span>') + '<span class="chip c-neutral">' + esc(it.uom) + '</span></div><h1 class="h1">' + esc(it.desc) + '</h1></div>' +
      '<div class="kpis">' + kpiBox(t('st_stock'), nf(s.qty), it.uom + (mn && s.qty < mn ? ' · ' + t('st_under') : ''), mn && s.qty < mn ? 'bad' : 'mute', '#/articolo/' + id + '?nave=' + ship) +
      kpiBox(t('st_incoming'), nf(s.inArr), it.uom, 'mute', '#/docs' + qs({ tipo: 'DN', nave: ship, aperti: 1 })) +
      kpiBox(t('st_avg'), s.qty ? nf(s.val / s.qty) : '—', s.last ? t('st_lastPrice') + ' ' + nf(s.last.price) : '', 'mute', '#/articolo/' + id + '?nave=' + ship) +
      kpiBox(t('st_val'), nf(s.val), '€', 'mute', '#/magazzino' + qs({ nave: ship })) + '</div>' +
      '<div class="filters"><label class="tog">' + esc(t('st_min')) + ' <input class="j" data-act="minstock" data-k="' + ship + '|' + id + '" value="' + (mn ? nf(mn) : '') + '" inputmode="decimal" style="width:80px;border:0;background:transparent;text-align:right" aria-label="' + esc(t('st_min')) + '"></label><span style="flex:1"></span>' + acts + '</div>' +
      '<h2 style="margin:0;font-size:15px">' + esc(t('st_moves')) + '</h2>' + movesTable(s.moves.slice().reverse(), false) +
      '<h2 style="margin:0;font-size:15px">' + esc(t('st_prices')) + '</h2>' +
      (prices.length ? '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('c_date')) + '</th><th>' + esc(t('c_num')) + '</th><th>' + esc(t('c_ship')) + '</th><th>' + esc(t('c_sup')) + '</th><th class="num">' + esc(t('l_qty')) + '</th><th class="num">' + esc(t('l_price')) + '</th><th class="num">' + esc(t('l_disc')) + '</th><th class="num">€ / ' + esc(it.uom) + '</th></tr></thead><tbody>' +
        prices.map(function (p) { return '<tr class="r" data-href="#/doc/' + p.po.id + '"><td class="j">' + fd(p.po.date) + '</td><td class="j">' + esc(p.po.num) + '</td><td>' + COLS.ship.v(p.po) + '</td><td>' + esc(supName(p.po.sup)) + '</td><td class="num j">' + nf(p.l.qty) + '</td><td class="num j">' + money(p.l.price, p.po.cur) + '</td><td class="num j">' + (p.l.d1 ? nf(p.l.d1, 1) + '%' : '') + '</td><td class="num j"><b>' + nf(unitEur(p.po, p.l)) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' : '<div class="empty">—</div>');
    return shell('magazzino', crumb([[t('fleet'), '#/'], [shipBy(ship).name, '#/nave/' + ship], [t('stores'), '#/magazzino' + qs({ nave: ship })]]), it.impa || 'GI0001', body);
  }
  function nextNum(ship, type) {
    var y = TODAY.slice(0, 4), pre = ship + '/' + y + '/' + type + '/', n = 0;
    DB.docs.forEach(function (d) { if (d.num && d.num.indexOf(pre) === 0) n = Math.max(n, parseInt(d.num.slice(pre.length), 10) || 0); });
    return pre + ('000' + (n + 1)).slice(-4);
  }
  function stockModal(kind, id, ship) {
    var it = itemById(id), s = stockOf(ship)[id] || { qty: 0, val: 0 };
    var fields = kind === 'consume'
      ? [{ n: 'q', l: t('l_qty') + ' (' + it.uom + ', max ' + nf(s.qty) + ')', v: '1', req: 1, num: 1 }, { n: 'c', l: t('st_cause'), type: 'select', opts: P.lang === 'en' ? ['Ordinary use', 'PMS job', 'Breakdown', 'Expired / damaged'] : ['Consumo ordinario', 'Lavoro PMS', 'Avaria', 'Scaduto / danneggiato'], v: '' }, { n: 'n', l: t('note'), v: '' }]
      : [{ n: 'q', l: t('st_counted') + ' (' + it.uom + ', ' + (P.lang === 'en' ? 'system' : 'a sistema') + ' ' + nf(s.qty) + ')', v: nf(s.qty), req: 1, num: 1 }, { n: 'n', l: t('note'), v: '' }];
    modal((kind === 'consume' ? t('st_consume') : t('st_count')) + ' · ' + it.desc, fields, function (v) {
      var q = parseNum(v.q), delta = kind === 'consume' ? -Math.min(q, s.qty) : q - s.qty;
      if (!delta) { toast(t('done')); return; }
      var type = kind === 'consume' ? 'CS' : 'INV', avg = s.qty ? s.val / s.qty : 0;
      var d = { id: type + '-' + Date.now(), type: type, num: nextNum(ship, type), ship: ship, desc: (kind === 'consume' ? v.c : t('st_count')) + ' · ' + it.desc, status: 'registrato', side: 'ship', date: TODAY,
        lines: [{ row: 10, item: id, code: it.code, impa: it.impa, desc: it.desc, note: v.n, uom: it.uom, qty: Math.abs(delta) }], log: [{ at: TODAY, to: 'registrato', txt: t(type + '1') + (v.n ? ' · ' + v.n : '') }] };
      DB.docs.push(d);
      DB.moves = DB.moves || [];
      DB.moves.push({ id: 'M-' + d.id, ship: ship, item: id, date: TODAY, qty: delta, kind: kind === 'consume' ? 'scarico' : 'rettifica', doc: d.id, row: 10, cost: Math.round(avg * 10000) / 10000, note: kind === 'consume' ? v.c : '' });
      save(); render(); toast(t(type + '1') + ' ' + d.num);
    });
  }
  function reorder(ship) {
    var S = stockOf(ship), lines = [], row = 0;
    (DB.items || []).forEach(function (it) { var s = S[it.id], mn = minOf(ship, it.id); if (s && mn > 0 && s.qty + s.inArr < mn) { row += 10; lines.push({ row: row, item: it.id, code: it.code, impa: it.impa, desc: it.desc, note: '', uom: it.uom, qty: Math.ceil(mn - s.qty - s.inArr), due: null }); } });
    if (!lines.length) { toast(P.lang === 'en' ? 'Incoming goods already cover the minimum' : 'La merce in arrivo copre già la scorta minima'); return; }
    var d = { id: 'RQ-' + Date.now(), type: 'RQ', num: nextNum(ship, 'RQ'), ship: ship, desc: P.lang === 'en' ? 'Restock below minimum' : 'Reintegro articoli sotto scorta', status: 'bozza', side: P.seat === 'ship' ? 'ship' : 'office', dept: 'ENG', date: TODAY, due: null, lines: lines, from: [],
      log: [{ at: TODAY, to: 'bozza', txt: (P.lang === 'en' ? 'Created from stores, ' : 'Creata dal magazzino, ') + lines.length + ' ' + t('rows') }] };
    DB.docs.push(d); save(); location.hash = '#/doc/' + d.id;
  }

  /* ---------- global search ---------- */
  function searchAll(q) {
    q = q.trim().toUpperCase(); if (q.length < 2) return [];
    var out = [];
    DB.ships.forEach(function (s) { if ((s.code + ' ' + s.name).toUpperCase().indexOf(q) >= 0) out.push({ k: t('c_ship'), l: s.name + ' · ' + s.code, h: '#/nave/' + s.code }); });
    DB.suppliers.forEach(function (s) { if ((s.name + ' ' + s.id).toUpperCase().indexOf(q) >= 0 && out.length < 6) out.push({ k: t('c_sup'), l: s.name, h: '#/fornitore/' + encodeURIComponent(s.id) }); });
    var ds = DB.docs.filter(function (d) { return matchQ(d, q); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    ds.slice(0, 8).forEach(function (d) { out.push({ k: d.type + ' · ' + d.ship, l: d.num + '  ' + d.desc, h: '#/doc/' + d.id, s: stLabel(d) }); });
    if (ds.length > 8) out.push({ k: '', l: (P.lang === 'en' ? 'All ' : 'Tutti i ') + ds.length + ' ' + t('results') + ' →', h: '#/docs' + qs({ tipo: ds[0].type, q: q }) });
    var ci = 0; (DB.items || []).forEach(function (it) { if (ci < 4 && ((it.impa || '') + ' ' + it.desc).toUpperCase().indexOf(q) >= 0) { ci++; out.push({ k: t('stores'), l: (it.impa ? it.impa + ' · ' : '') + it.desc, h: '#/articolo/' + it.id + '?nave=PEP' }); } });
    var c = 0; DB.accounts.forEach(function (a) { if (a.post && c < 3 && (a.code + ' ' + a.desc).toUpperCase().indexOf(q) >= 0) { c++; out.push({ k: t('acct'), l: a.path + ' · ' + a.desc, h: '#/budget' }); } });
    return out;
  }
  function drawResults() {
    var box = document.getElementById('gres'); if (!box) return;
    var inp = document.getElementById('gsearch');
    if (!inp || !inp.value.trim()) { box.innerHTML = ''; return; }
    var r = UI.results;
    box.innerHTML = '<div class="results" role="listbox">' + (r.length ? r.map(function (x, i) {
      return '<a role="option" href="' + x.h + '" class="' + (i === UI.resSel ? 'sel' : '') + '"><span class="k j">' + esc(x.k) + '</span><span style="flex:1">' + esc(x.l) + '</span>' + (x.s ? '<span class="mute" style="font-size:12px">' + esc(x.s) + '</span>' : '') + '</a>';
    }).join('') : '<a href="#" onclick="return false"><span class="mute">' + esc(t('noResults')) + '</span></a>') + '</div>';
  }

  /* ---------- render & events ---------- */
  function render() {
    var r = route(), s = r.seg, html;
    if (!s.length) html = pageHome();
    else if (s[0] === 'nave') html = pageShip(s[1]);
    else if (s[0] === 'docs') html = pageDocs(r.q);
    else if (s[0] === 'doc') html = pageDoc(s[1]);
    else if (s[0] === 'budget') html = pageBudget(r.q);
    else if (s[0] === 'fornitori') html = pageSuppliers(r.q);
    else if (s[0] === 'fornitore') html = pageSupplier(decodeURIComponent(s[1]));
    else if (s[0] === 'scadenze') html = pageDue(r.q);
    else if (s[0] === 'modulo') html = pageSoon(s[1]);
    else if (s[0] === 'magazzino') html = pageStores(r.q);
    else if (s[0] === 'articolo') html = pageItem(s[1], r.q);
    else if (s[0] === 'dati') html = pageData();
    else html = pageHome();
    var active = document.activeElement, keepFilter = active && active.getAttribute && active.getAttribute('data-filter') === 'q' ? active.selectionStart : null;
    root.innerHTML = html;
    document.documentElement.lang = P.lang;
    if (keepFilter !== null) { var f = root.querySelector('[data-filter="q"]'); if (f) { f.focus(); try { f.setSelectionRange(keepFilter, keepFilter); } catch (e) {} } }
  }
  function setQ(k, v) {
    var r = route(), q = r.q; if (v) q[k] = v; else delete q[k];
    var h = '#/' + r.seg.join('/') + qs(q);
    history.replaceState(null, '', h); render();
  }
  window.addEventListener('hashchange', function () { UI.colOpen = false; render(); window.scrollTo(0, 0); });

  root.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]');
    if (e.target.closest('[data-stop]')) return;
    if (!a) {
      var tr = e.target.closest('tr[data-href]'); if (tr) { location.hash = tr.getAttribute('data-href'); return; }
      if (UI.colOpen && !e.target.closest('.colmenu')) { UI.colOpen = false; render(); }
      return;
    }
    var act = a.getAttribute('data-act'), r = route();
    if (act === 'theme') { P.theme = effTheme() === 'dark' ? 'light' : 'dark'; savePrefs(); document.documentElement.setAttribute('data-theme', P.theme); render(); }
    else if (act === 'lang') { P.lang = P.lang === 'en' ? 'it' : 'en'; savePrefs(); render(); }
    else if (act === 'sort') {
      var tipo = r.q.tipo || 'RQ', k = a.getAttribute('data-k'), cur = P.sort[tipo] || { k: 'date', d: -1 };
      P.sort[tipo] = { k: k, d: cur.k === k ? -cur.d : 1 }; savePrefs(); render();
    }
    else if (act === 'seat') { P.seat = P.seat === 'ship' ? 'office' : 'ship'; savePrefs(); render(); toast(t(P.seat === 'ship' ? 'seatShip' : 'seatOffice')); }
    else if (act === 'consume' || act === 'count') { stockModal(act, a.getAttribute('data-item'), a.getAttribute('data-ship')); }
    else if (act === 'reorder') { reorder(a.getAttribute('data-ship')); }
    else if (act === 'colmenu') { UI.colOpen = !UI.colOpen; render(); }
    else if (act === 'bexp') { UI.expanded[a.getAttribute('data-k')] = a.getAttribute('data-o') !== '1'; render(); }
    else if (act === 'adv') {
      var d = byId(r.seg[1]), to = a.getAttribute('data-to'), form = a.getAttribute('data-form');
      if (form === 'offer') {
        var sp = supById(d.sup);
        modal(ST.RFQ.quotata[P.lang === 'en' ? 1 : 0], [
          { n: 'tot', l: t('offerTotal'), v: d.total ? nf(d.total) : '', req: 1, num: 1 },
          { n: 'cur', l: t('currency'), type: 'select', opts: ['EUR', 'USD'], v: d.cur || (sp && sp.cur) || 'EUR' },
          { n: 'ref', l: t('extRef'), v: '' },
          { n: 'days', l: t('validDays'), v: '30', num: 1 }], function (v) {
          d.total = parseNum(v.tot); d.cur = v.cur; d.offer = { ref: v.ref, days: parseInt(v.days, 10) || 30, at: TODAY };
          advance(d, to, money(d.total, d.cur));
        });
      } else if (form === 'approve') {
        modal(t('appr'), [{ n: 'note', l: t('note'), type: 'area' }], function (v) { advance(d, to, v.note); });
      } else if (form === 'receive') { receiveModal(d);
      } else advance(d, to);
    }
    else if (act === 'cancel') {
      var dc = byId(r.seg[1]);
      modal(t('cancel') + ' ' + dc.num, [{ n: 'why', l: t('reason'), type: 'area', req: 1 }], function (v) { advance(dc, CANCEL[dc.type], v.why); });
    }
    else if (act === 'export') {
      var blob = new Blob([JSON.stringify(DB, null, 1)], { type: 'application/json' });
      var u = URL.createObjectURL(blob), l = document.createElement('a'); l.href = u; l.download = 'fleet-asset-' + TODAY + '.json'; document.body.appendChild(l); l.click(); l.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
    }
    else if (act === 'reset') { modal(t('d_reset'), [{ n: 'ok', l: t('d_resetQ'), v: P.lang === 'en' ? 'RESET' : 'RIPRISTINA' }], function () { DB = clone(window.SEED); save(); render(); toast(t('done')); }); }
    else if (act === 'copyjson') { try { navigator.clipboard.writeText(JSON.stringify(DB)).then(function () { toast(t('done')); }, function () { toast('Clipboard ?'); }); } catch (x) { toast('Clipboard ?'); } }
  });
  root.addEventListener('change', function (e) {
    var el = e.target;
    if (el.getAttribute('data-act') === 'col') {
      var tipo = route().q.tipo || 'RQ', cols = (P.cols[tipo] || TYPECOLS[tipo].def).slice(), k = el.getAttribute('data-k');
      if (el.checked && cols.indexOf(k) < 0) { var order = TYPECOLS[tipo].all; cols.push(k); cols.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); }); }
      if (!el.checked) cols = cols.filter(function (c) { return c !== k; });
      if (!cols.length) cols = ['num'];
      P.cols[tipo] = cols; savePrefs(); render(); return;
    }
    if (el.getAttribute('data-act') === 'zero') { UI.showZero = el.checked; render(); return; }
    if (el.getAttribute('data-act') === 'minstock') { var k2 = el.getAttribute('data-k'); DB.stock = DB.stock || {}; DB.stock[k2] = Math.max(0, parseNum(el.value)); save(); render(); toast(t('minSaved')); return; }
    if (el.getAttribute('data-act') === 'import') {
      var f = el.files && el.files[0]; if (!f) return;
      var rd = new FileReader(); rd.onload = function () { try { var o = JSON.parse(rd.result); if (!o.docs || !o.meta) throw 0; DB = o; save(); render(); toast(t('done')); } catch (x) { toast('JSON ?'); } }; rd.readAsText(f); return;
    }
    if (el.id === 'fxin') { var v = parseNum(el.value); if (v > 0.2 && v < 5) { DB.meta.fx = v; save(); render(); toast(t('fxLabel') + ' ' + nf(v, 4)); } else render(); return; }
    var fk = el.getAttribute('data-filter');
    if (fk && fk !== 'q') setQ(fk, el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value);
  });
  root.addEventListener('input', function (e) {
    var el = e.target;
    if (el.id === 'gsearch') { UI.results = searchAll(el.value); UI.resSel = 0; drawResults(); return; }
    if (el.getAttribute('data-filter') === 'q') setQ('q', el.value);
  });
  root.addEventListener('keydown', function (e) {
    if (e.target.id === 'gsearch') {
      if (e.key === 'ArrowDown') { UI.resSel = Math.min(UI.results.length - 1, UI.resSel + 1); drawResults(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { UI.resSel = Math.max(0, UI.resSel - 1); drawResults(); e.preventDefault(); }
      else if (e.key === 'Enter' && UI.results[UI.resSel]) { location.hash = UI.results[UI.resSel].h; }
      else if (e.key === 'Escape') { e.target.value = ''; drawResults(); }
    }
    if (e.target.id === 'fxin' && e.key === 'Enter') e.target.blur();
  });
  root.addEventListener('focusout', function (e) {
    if (e.target.id === 'gsearch') setTimeout(function () { var b = document.getElementById('gres'); if (b && !b.contains(document.activeElement)) b.innerHTML = ''; }, 150);
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { var s = document.getElementById('gsearch'); if (s) { s.focus(); s.select(); e.preventDefault(); } }
  });

  render();
})();
