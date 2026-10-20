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
    RQ: ['Richieste', 'Requisitions'], RFQ: ['RFQ', 'RFQs'], PO: ['Ordini', 'Orders'], DN: ['Consegne', 'Deliveries'], FT: ['Fatture', 'Invoices'], FT1: ['Fattura fornitore', 'Supplier invoice'], sc_ft: ['Pagamento fattura', 'Invoice payment'],
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
    goods: ['Merce', 'Goods'], ch_transport: ['Trasporto', 'Transport'], ch_packing: ['Imballo', 'Packing'], ch_other: ['Altre spese', 'Other charges'], ch_hub: ['Hub / handling', 'Hub / handling'], ch_customs: ['Dogana', 'Customs'], ch_bank: ['Spese bancarie', 'Bank charges'], grand: ['Totale documento', 'Document total'],
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
    DN: { pronta: ['Pronta per spedizione', 'Ready for shipment'], hub: ['In hub spedizioniere', 'At forwarder hub'], spedita: ['Spedita alla nave', 'Shipped to vessel'], ricevuta: ['Ricevuta a bordo', 'Received on board'] },
    CS: { registrato: ['Registrato', 'Recorded'] }, INV: { registrato: ['Registrato', 'Recorded'] },
    FT: { registrata: ['Registrata', 'Booked'], pagata: ['Pagata', 'Paid'] }
  };
  var TONE = { bozza: 'neutral', creata: 'neutral', endorsed: 'warn', verifica: 'info', quotazione: 'info', inviata: 'info', inviato: 'info', quotata: 'acc', approvato: 'acc', confermato: 'info', ordinata: 'ok', finalizzato: 'ok', pronta: 'warn', spedita: 'info', ricevuta: 'ok', chiusa: 'neutral', annullata: 'bad', annullato: 'bad', rifiutata: 'bad', registrato: 'ok', hub: 'warn', registrata: 'warn', pagata: 'ok' };
  var FLOW = {
    RQ: ['bozza', 'endorsed', 'verifica', 'quotazione', 'quotata', 'ordinata', 'chiusa'],
    RFQ: ['creata', 'inviata', 'quotata'],
    PO: ['bozza', 'approvato', 'inviato', 'confermato', 'finalizzato'],
    DN: ['pronta', 'hub', 'spedita', 'ricevuta'],
    CS: ['registrato'], INV: ['registrato'], FT: ['registrata', 'pagata']
  };
  var OPTIONAL = { PO: { confermato: 1 }, DN: { hub: 1 } };
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
      spedita: [{ to: 'ricevuta', l: ['Ricevi e carica a magazzino (DN firmata)', 'Receive and load stores (signed DN)'], form: 'receive', ship: 1 }]
    }
  };
  var CANCEL = { RQ: 'annullata', RFQ: 'annullata', PO: 'annullato' };
  var OPEN = {
    RQ: { bozza: 1, endorsed: 1, verifica: 1, quotazione: 1, quotata: 1 },
    RFQ: { creata: 1, inviata: 1 },
    PO: { bozza: 1, approvato: 1, inviato: 1, confermato: 1 },
    DN: { pronta: 1, hub: 1, spedita: 1 },
    FT: { registrata: 1 }
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
    function add(path, o, dl) { var cur = path; while (cur) { var x = out[cur]; if (x) { x.o += o; x.d += dl; } cur = A[cur] ? A[cur].parent : null; } }
    DB.docs.forEach(function (d) {
      if (!d.proto || d.ship !== ship) return;
      if (d.type === 'PO' && d.account && d.lines && { approvato: 1, inviato: 1, confermato: 1, finalizzato: 1 }[d.status]) {
        var rec = poReceived(d), o = 0, dl = 0;
        d.lines.forEach(function (l) { var u = unitEur(d, l), r = Math.min(rec[l.row] || 0, l.qty); o += (l.qty - r) * u; dl += r * u; });
        var anyRec = Object.keys(rec).some(function (k) { return rec[k] > 0; });
        (d.charges || []).forEach(function (c) { if (anyRec) dl += toEur(c.amount, d.cur); else o += toEur(c.amount, d.cur); });
        add(d.account, o, dl);
      }
      if (d.type === 'FT') (d.charges || []).forEach(function (c) { if (c.account && c.amount) add(c.account, 0, toEur(c.amount, d.cur)); });
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
      railLink('#/contabilita', 'doc', L2(['Contabilità', 'Accounting']), active === 'contabilita') +
      '<div class="sp"></div>' + railLink('#/impostazioni', 'doc', L2(['Modelli', 'Templates']), active === 'impostazioni') + railLink('#/dati', 'db', t('data'), active === 'dati') +
      '</nav><div class="main"><header class="top">' +
      '<div class="crumbs"><small>' + crumbs + '</small><b>' + esc(title) + '</b></div>' +
      '<div class="search"><label>' + ico('search') + '<input id="gsearch" type="search" autocomplete="off" aria-label="' + esc(t('search')) + '" placeholder="' + esc(t('search')) + '"><span class="kbd j">Ctrl K</span></label><div id="gres"></div></div>' +
      '<div class="tools">' + (DB.meta.demo ? '<a class="chip c-warn" href="#/dati" style="text-decoration:none">' + esc(P.lang === 'en' ? 'Sample data' : 'Dati di esempio') + '</a>' : '') + '<label class="fx j" title="' + esc(t('fxLabel')) + '">1 € = <input id="fxin" class="j" value="' + nf(fx(), 4) + '" aria-label="' + esc(t('fxLabel')) + '"> $</label>' +
      (UI.edit && UI.edit.id !== (route().seg[1] || '') ? '<a class="chip c-bad" style="text-decoration:none" href="#/doc/' + UI.edit.id + '">' + esc(L2(['Modifica non salvata', 'Unsaved edit'])) + '</a>' : '') +
      '<label class="fx" title="' + esc(L2(['Postazione', 'Station'])) + '"><select id="seatsel" aria-label="' + esc(L2(['Postazione', 'Station'])) + '" style="border:0;background:transparent;font-weight:700">' +
      [['office', ['Ufficio acquisti', 'Purchasing office']], ['ship', ['Bordo', 'Vessel']], ['acc', ['Contabilità', 'Accounting']]].map(function (o) { return '<option value="' + o[0] + '"' + (P.seat === o[0] ? ' selected' : '') + '>' + esc(L2(o[1])) + '</option>'; }).join('') + '</select></label>' +
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
    var demo = byId('DEMO-RQ'), demoChain = docs(function (d) { return d.demo; });
    var demoLast = demoChain.slice().sort(function (a, b) { return FLOWORDER[b.type] - FLOWORDER[a.type]; })[0];
    var side = '<aside class="side">' +
      '<section class="card stack" style="border-color:var(--accLine)"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2>' + esc(L2(['Pratica demo', 'Demo case'])) + '</h2><span class="chip c-acc">DEMO</span></div>' +
      '<div style="font-size:13px">' + esc(demo ? demo.num + ' · ' + demo.desc : '—') + '</div>' +
      (demoLast ? '<div class="mute" style="font-size:12px">' + esc(L2(['A che punto è: ', 'Current step: '])) + esc(t(demoLast.type + '1')) + ' ' + esc(demoLast.num) + ' · ' + esc(stLabel(demoLast)) + '</div>' : '') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn pri" href="#/doc/' + (demoLast ? demoLast.id : 'DEMO-RQ') + '">' + esc(L2(['Riprendi', 'Resume'])) + '</a><button class="btn" data-act="demoreset">' + esc(L2(['Ricomincia da capo', 'Start over'])) + '</button></div></section>' +
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
    DN: { all: ['num', 'orig', 'ship', 'desc', 'status', 'sup', 'deliverTo', 'side', 'dept', 'date', 'due', 'from'], def: ['num', 'ship', 'desc', 'sup', 'status', 'side', 'date', 'due', 'from'] },
    FT: { all: ['num', 'ship', 'desc', 'status', 'sup', 'total', 'eur', 'usd', 'date', 'due', 'from'], def: ['num', 'ship', 'desc', 'sup', 'status', 'total', 'eur', 'date', 'due', 'from'] }
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
    var tabs = ['RQ', 'RFQ', 'PO', 'DN', 'FT'].map(function (ty) {
      var n = base.filter(function (d) { return d.type === ty; }).length;
      return '<a class="' + (ty === tipo ? 'on' : '') + '" href="#/docs' + qs({ tipo: ty, nave: nave }) + '">' + esc(t(ty)) + '<span class="j">' + n + '</span></a>';
    }).join('');
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
      (tipo === 'RQ' ? '<button class="btn pri sm" data-act="newrq" data-ship="' + nave + '">' + esc(L2(['Nuova richiesta', 'New requisition'])) + '</button>' : '') +
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
      '<dt>' + esc(d.type === 'FT' ? L2(['Scadenza pagamento', 'Payment due']) : d.type === 'DN' ? t('sc_dn') : t('c_due')) + '</dt><dd class="j' + (isLate(d) && d.type !== 'RFQ' ? ' t-bad' : '') + '">' + fd(d.due) + '</dd>' +
      (d.limit ? '<dt>' + esc(t('c_limit')) + '</dt><dd class="j' + (isLate(d) ? ' t-bad' : '') + '">' + fd(d.limit) + '</dd>' : '') +
      (d.deliverTo ? '<dt>' + esc(t('c_deliverTo')) + '</dt><dd>' + esc(d.deliverTo) + '</dd>' : '') +
      (d.terms ? '<dt>' + esc(t('terms')) + '</dt><dd>' + esc(d.terms) + '</dd>' : '') +
      (d.offer ? '<dt>' + esc(t('extRef')) + '</dt><dd>' + esc(d.offer.ref || '—') + ' · ' + esc(t('validDays')) + ' ' + d.offer.days + '</dd>' : '') +
      (d.type === 'PO' && d.account ? '<dt>' + esc(L2(['Conto di budget', 'Budget account'])) + '</dt><dd class="j">' + esc(d.account) + '</dd>' : '') +
      (d.type === 'DN' && d.route ? '<dt>' + esc(L2(['Percorso', 'Route'])) + '</dt><dd>' + esc(d.route === 'hub' ? L2(['Via hub', 'Via hub']) + ' · ' + d.hub : L2(['Diretta a bordo', 'Direct on board'])) + (d.port ? ' → ' + esc(d.port) : '') + '</dd>' : '') +
      '<dt>' + esc(d.type === 'FT' ? L2(['N. fattura fornitore', 'Supplier invoice no.']) : t('c_orig')) + '</dt><dd class="j">' + esc(d.orig || '—') + '</dd></dl></section>';
    var lines = (linesOpen(d) && !(UI.edit && UI.edit.id === d.id) && !d.lines.length) ? '<section class="card stack"><h2>' + esc(t('lines')) + '</h2><div class="note">' + esc(L2(['Nessuna riga. Premi Modifica per aggiungere gli articoli.', 'No rows. Press Edit to add items.'])) + '</div></section>' : editable(d) ? rqEditor(d) + comparison(d) : (UI.edit && UI.edit.id === d.id && d.type === 'PO' && d.lines) ? poEditor(d) : d.lines ? linesTable(d) + (d.type === 'RQ' ? comparison(d) : '') : '<section class="card stack"><h2>' + esc(t('lines')) + '</h2><div class="note">' + esc(t('noLines')) + '</div></section>';

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
    var acts = actionsFor(d);
    var nextHtml;
    if (!acts.length) nextHtml = '<section class="card"><div class="mute">' + esc(t('closed')) + '</div></section>';
    else {
      var pri = acts.filter(function (a) { return !a.sec; }), sec = acts.filter(function (a) { return a.sec; });
      nextHtml = '<section class="next"><div class="k">' + esc(t('next').toUpperCase()) + '</div><div class="t">' + esc(pri[0].l[P.lang === 'en' ? 1 : 0]) + '</div>' +
        (d.type === 'PO' && d.status === 'bozza' ? '<div style="font-size:12px">' + esc(t('impactTxt')) + '</div>' : '') +
        pri.map(function (a) {
          if (a.ship && P.seat !== 'ship') return '<div class="note" style="background:var(--panel)"><b>' + esc(t('onlyShipAct')) + '</b><br>' + esc(d.type === 'DN' ? t('onlyShip') : a.l[P.lang === 'en' ? 1 : 0]) + '</div><button class="btn" data-act="seat" data-to="ship">' + esc(t('toShipSeat')) + '</button>';
          if (a.acc && P.seat !== 'acc') return '<div class="note" style="background:var(--panel)"><b>' + esc(L2(['Azione della Contabilità', 'Accounting action'])) + '</b><br>' + esc(a.l[P.lang === 'en' ? 1 : 0]) + '</div><button class="btn" data-act="seat" data-to="acc">' + esc(L2(['Passa alla postazione Contabilità', 'Switch to Accounting station'])) + '</button>';
          if (UI.edit && UI.edit.id === d.id) return '<div class="note" style="background:var(--panel)">' + esc(L2(['Salva o annulla la modifica per proseguire.', 'Save or cancel the edit to continue.'])) + '</div>';
          return '<button class="btn pri" data-act="adv" data-to="' + a.to + '" data-form="' + (a.form || '') + '">' + esc(a.l[P.lang === 'en' ? 1 : 0]) + '</button>';
        }).join('') +
        '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">' + sec.map(function (a) { return '<button class="btn sm" data-act="adv" data-to="' + a.to + '" data-form="' + (a.form || '') + '">' + esc(a.l[P.lang === 'en' ? 1 : 0]) + '</button>'; }).join('') +
        (CANCEL[d.type] ? '<button class="btn link" data-act="cancel">' + esc(t('cancel')) + '</button>' : '') + '</div></section>';
    }
    var log = (d.log || []).slice().reverse().map(function (e) { return '<div><span class="j">' + fd(e.at) + '</span><span>' + esc(e.txt) + '</span></div>'; }).join('') ||
      '<div><span class="j">' + fd(d.date) + '</span><span>' + esc(P.lang === 'en' ? 'Imported from InfoSHIP' : 'Importato da InfoSHIP') + ' · ' + esc(stLabel(d)) + '</span></div>';

    var head = '<div class="stack" style="gap:8px"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="j mute">' + esc(d.num) + '</span>' + chip(d) +
      (isLate(d) ? '<span class="chip c-bad">' + esc(t('late')) + '</span>' : '') +
      (d.prio && d.prio !== 'normale' ? '<span class="chip c-bad">' + esc(L2(PRIO[d.prio])) + '</span>' : '') + (d.demo ? '<span class="chip c-acc">DEMO</span>' : '') +
      '<span class="chip c-neutral">' + esc(t('c_side')) + ': ' + esc(t(d.side)) + '</span>' + (d.dept ? '<span class="chip c-neutral">' + esc(t(d.dept)) + '</span>' : '') +
      (d.rev ? '<span class="chip c-warn">Rev. ' + d.rev + '</span>' : '') +
      ((d.type === 'RFQ' || d.type === 'PO') && d.lines && d.lines.length ? '<button class="btn sm" data-act="pdf">PDF</button>' : '') +
      (UI.edit && UI.edit.id === d.id ? '' : '<button class="btn sm" data-act="editstart">' + esc(L2(['Modifica', 'Edit'])) + '</button>') + '</div>' +
      (UI.edit && UI.edit.id === d.id ? editHeader(d) : '<h1 class="h1">' + esc(d.desc || '—') + '</h1>' + (d.note ? '<div class="note">' + esc(d.note) + '</div>' : '')) + '</div>';
    var body = '<div class="row">' + pathHtml +
      '<div class="grow stack" style="gap:14px">' + head + info + lines + '</div>' +
      '<aside class="side">' + nextHtml + '<section class="card stack"><h2>' + esc(t('chain')) + '</h2><div class="chain">' + chainHtml + '</div></section>' +
      '<section class="card stack"><h2>' + esc(t('history')) + '</h2><div class="log">' + log + '</div></section></aside></div>';
    return shell('doc', crumb([[t('fleet'), '#/'], [shipBy(d.ship).name, '#/nave/' + d.ship], [t(d.type), '#/docs' + qs({ tipo: d.type, nave: d.ship })]]), t(d.type + '1') + ' ' + d.num, body);
  }
  var FLOWORDER = { RQ: 0, RFQ: 1, PO: 2, DN: 3, FT: 4 };

  function advance(d, to, extra) { setStatus(d, to, extra); save(); render(); toast(t('done') + ': ' + ST[d.type][to][P.lang === 'en' ? 1 : 0]); }
  function setStatus(d, to, extra) {
    var from = d.status; d.status = to;
    d.log = d.log || [];
    if (!d.log.length) d.log.push({ at: d.date, to: from, txt: (P.lang === 'en' ? 'Imported from InfoSHIP · ' : 'Importato da InfoSHIP · ') + ST[d.type][from][P.lang === 'en' ? 1 : 0] });
    d.log.push({ at: TODAY, to: to, txt: ST[d.type][to][P.lang === 'en' ? 1 : 0] + (extra ? ' · ' + extra : '') });
    if (d.type === 'DN' && to === 'ricevuta') d.side = 'office';
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
      return { d: d, at: lateDate(d), k: d.type === 'RFQ' ? 'sc_rfq' : d.type === 'PO' ? 'sc_po' : d.type === 'DN' ? 'sc_dn' : d.type === 'FT' ? 'sc_ft' : 'sc_rq' };
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
  function lineDesc(l) { return '<div>' + esc(l.desc) + '</div>' + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') + (l.impa ? '<div class="mute j" style="font-size:11px">IMPA ' + esc(l.impa) + '</div>' : '') +
    (l.cond ? '<div style="font-size:12px;margin-top:2px">' + condChip(l.cond) + ' <span class="mute">' + esc(l.origin || '') + (l.days != null ? ' · ' + l.days + ' gg' : '') + '</span></div>' : '') + (l.quoted === false ? '<div class="chip c-neutral" style="margin-top:2px">' + esc(L2(['Non quotato', 'Not quoted'])) + '</div>' : '') + (l.asset ? '<div class="mute" style="font-size:11px">Asset: ' + esc(l.asset) + '</div>' : ''); }
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
      if (d.type === 'PO' || ((d.type === 'RFQ' || d.type === 'FT') && d.total)) {
        var goods = d.type === 'FT' ? d.goods : d.lines.reduce(function (a, l) { return a + (l.quoted === false ? 0 : (l.net || 0)); }, 0);
        var ch = (d.charges || []).filter(function (c) { return c.amount; }).map(function (c) { return '<dt>' + esc(t('ch_' + c.kind)) + (c.note ? ' <span class="mute">(' + esc(c.note) + ')</span>' : '') + (c.account ? ' <span class="j mute">' + esc(c.account) + '</span>' : '') + '</dt><dd class="j" style="text-align:right">' + money(c.amount, d.cur) + '</dd>'; }).join('');
        foot = (d.type === 'FT' && Math.abs(d.goods - d.poGoods) > 0.005 ? '<div class="note" style="color:var(--red)">' + esc(L2(['Merce fatturata diversa dal valore ricevuto da ordine: ', 'Invoiced goods differ from received order value: '])) + money(d.poGoods, d.cur) + ' → ' + money(d.goods, d.cur) + '</div>' : '') +
          '<dl class="kv" style="max-width:460px;margin-left:auto"><dt>' + esc(t('goods')) + '</dt><dd class="j" style="text-align:right">' + money(goods, d.cur) + '</dd>' + ch +
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
      return '<tr><td class="j">' + l.row + '</td><td>' + esc(l.desc) + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') + '</td><td class="num j">' + nf(l.qty) + ' ' + esc(l.uom) + '</td><td><input name="q' + i + '" value="' + nf(l.qty) + '" inputmode="decimal" style="width:90px;text-align:right" aria-label="' + esc(t('l_recv')) + ' ' + l.row + '"></td><td><input name="loc' + i + '" value="' + esc(locOf(dn.ship, l.item) || '') + '" placeholder="' + esc(L2(['es. Magazzino macchina A3', 'e.g. Engine store A3'])) + '" style="width:170px" aria-label="' + esc(L2(['Ubicazione', 'Location'])) + '"></td></tr>';
    }).join('');
    bg.innerHTML = '<form class="modal" style="width:min(980px,100%);max-height:92vh;overflow:auto" role="dialog" aria-modal="true" aria-label="' + esc(t('rcvTitle')) + '"><h3>' + esc(L2(['Ricevi e carica a magazzino', 'Receive and load stores'])) + ' · ' + esc(dn.num) + '</h3>' +
      (rows ? '<p class="mute" style="margin:0;font-size:13px">' + esc(t('rcvTxt')) + '</p><div class="tablebox" style="max-height:45vh;overflow:auto"><table class="grid" style="min-width:560px"><thead><tr><th>' + esc(t('l_row')) + '</th><th>' + esc(t('c_desc')) + '</th><th class="num">' + esc(t('l_ship')) + '</th><th>' + esc(t('l_recv')) + '</th><th>' + esc(L2(['Ubicazione a bordo', 'Onboard location'])) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '') +
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
        if (!l.item && q > 0) l.item = ensureItem(l, po);
        if (q > 0 && l.item) {
          var pl = po && po.lines ? po.lines.filter(function (x) { return x.row === l.src; })[0] : null;
          var loc = (form.elements['loc' + i].value || '').trim(); if (loc) { DB.loc = DB.loc || {}; DB.loc[dn.ship + '|' + l.item] = loc; }
          DB.moves.push({ id: 'M-' + dn.id + '-' + l.row + '-' + Date.now(), ship: dn.ship, item: l.item, date: TODAY, qty: q, kind: 'carico', doc: dn.id, row: l.row, loc: loc, cost: pl ? Math.round(unitEur(po, pl) * 10000) / 10000 : 0 });
        }
      });
      dn.signed = (P.lang === 'en' ? 'Signed DN' : 'DN firmata') + (f ? ': ' + f.name : '') + ' · ' + fd(TODAY);
      dn.side = 'office';
      close();
      advance(dn, 'ricevuta', (dn.lines || []).length ? (dn.lines.length + ' ' + t('rows')) : '');
    });
  }
  function ensureItem(l, po) {
    DB.items = DB.items || [];
    var key = (l.impa || '').trim(), it = null;
    DB.items.forEach(function (x) { if (key ? x.impa === key : (!x.impa && x.desc.toUpperCase() === (l.desc + (l.note ? ' · ' + l.note : '')).toUpperCase())) it = x; });
    if (!it) { it = { id: 'N-' + Date.now() + '-' + Math.floor(Math.random() * 1e4), code: key || 'NEW', impa: key || null, desc: l.desc + (!key && l.note ? ' · ' + l.note : ''), uom: l.uom, generic: !key }; DB.items.push(it); }
    if (po && po.lines) po.lines.forEach(function (pl) { if (pl.row === l.src && !pl.item) pl.item = it.id; });
    return it.id;
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
    var tabs = '<nav class="tabs">' + [['arr', ['Arrivi da caricare', 'Arrivals to load']], ['art', 'st_items'], ['mov', 'st_moves'], ['doc', 'st_docs']].map(function (x) { var n = x[0] === 'arr' ? arrivals(ship).length : 0; return '<a class="' + (tab === x[0] ? 'on' : '') + '" href="#/magazzino' + qs({ nave: ship, tab: x[0] }) + '">' + esc(typeof x[1] === 'string' ? t(x[1]) : L2(x[1])) + (n ? '<span class="j">' + n + '</span>' : '') + '</a>'; }).join('') + '</nav>';
    var body;
    if (!items.length && tab === 'art' && !arrivals(ship).length) body = '<div class="empty">' + esc(P.lang === 'en' ? 'No items for this vessel yet. Stores fill up when orders with lines arrive and the vessel confirms the DN.' : 'Nessun articolo per questa nave. Il magazzino si riempie quando arrivano ordini con righe e la nave conferma la DN.') + '</div>';
    else if (tab === 'mov') {
      var mv = (DB.moves || []).filter(function (x) { return x.ship === ship; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      body = movesTable(mv, true);
    } else if (tab === 'arr') {
      body = arrivalsTable(ship);
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


  /* ---------- purchasing flow: requisition → RFQ → offer → award → PO → DN → invoice ---------- */
  var PRIO = { normale: ['Normale', 'Normal'], urgente: ['Urgente', 'Urgent'], critica: ['Critica', 'Critical'] };
  var CONDS = ['Genuine', 'Non genuine', 'Usato'];
  function L2(a) { return a[P.lang === 'en' ? 1 : 0]; }
  function addDays(iso, n) { var d = new Date(Date.parse(iso) + n * 864e5); return d.toISOString().slice(0, 10); }
  function condChip(c) { return '<span class="chip ' + (c === 'Genuine' ? 'c-ok' : c === 'Usato' ? 'c-violet' : 'c-warn') + '" style="font-size:11px;padding:1px 7px">' + esc(c === 'Usato' ? L2(['Usato / ricond.', 'Used / recond.']) : c) + '</span>'; }
  function cloneLine(l, extra) { var o = {}; for (var k in l) o[k] = l[k]; for (var e in extra) o[e] = extra[e]; return o; }
  function newDoc(type, ship, base, note) {
    var d = { id: type + '-' + Date.now() + '-' + Math.floor(Math.random() * 1e4), type: type, num: nextNum(ship, type), ship: ship, date: TODAY, side: 'office', proto: true, from: [], log: [] };
    for (var k in base) d[k] = base[k];
    d.log.push({ at: TODAY, to: d.status, txt: L2(ST[type][d.status]) + (note ? ' · ' + note : '') });
    DB.docs.push(d); return d;
  }
  function linesOpen(d) { return d.type === 'RQ' && !!d.lines && (d.status === 'bozza' || d.status === 'endorsed' || d.status === 'verifica'); }
  function editable(d) { return linesOpen(d) && !!UI.edit && UI.edit.id === d.id; }
  function docGoods(d) { return (d.lines || []).reduce(function (a, l) { return a + (l.quoted === false ? 0 : (l.net || 0)); }, 0); }
  function docTotal(d) { return Math.round((docGoods(d) + (d.charges || []).reduce(function (a, c) { return a + (c.amount || 0); }, 0)) * 100) / 100; }
  function postable(ship) {
    var B = DB.budgets[ship] || {};
    return DB.accounts.filter(function (a) { return a.post && (a.path.indexOf('00-') === 0 || a.path.indexOf('20-') === 0) && a.path.indexOf('00-10-') !== 0 && a.path.indexOf('00-11-') !== 0 && a.path.indexOf('00-12-') !== 0 && a.path.indexOf('00-8-') !== 0 && a.path.indexOf('00-9-') !== 0; })
      .sort(function (a, b) { return ((B[b.path] || {}).b || 0) - ((B[a.path] || {}).b || 0) || (a.path < b.path ? -1 : 1); });
  }
  function acctOptions(ship, sel) {
    return postable(ship).map(function (a) { return '<option value="' + esc(a.path) + '"' + (a.path === sel ? ' selected' : '') + '>' + esc(a.path + ' · ' + a.desc) + '</option>'; }).join('');
  }

  /* generic modal with custom HTML */
  function formModal(title, inner, onSubmit, opts) {
    opts = opts || {};
    var bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = '<form class="modal" style="width:min(' + (opts.w || 560) + 'px,100%);max-height:92vh;overflow:auto" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><h3>' + esc(title) + '</h3>' + inner +
      '<div class="acts">' + (opts.extra || '') + '<span style="flex:1"></span><button type="button" class="btn" data-x="1">' + esc(t('close')) + '</button><button class="btn pri" type="submit">' + esc(opts.ok || t('confirm')) + '</button></div></form>';
    document.body.appendChild(bg);
    var form = bg.querySelector('form');
    function close() { bg.remove(); }
    bg.addEventListener('click', function (e) { if (e.target === bg || e.target.getAttribute('data-x')) close(); if (opts.onClick) opts.onClick(e, form); });
    bg.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    bg.addEventListener('input', function (e) { if (opts.onInput) opts.onInput(e, form); });
    form.addEventListener('submit', function (e) { e.preventDefault(); if (onSubmit(form) !== false) close(); });
    var f = form.querySelector('input:not([type=checkbox]),textarea,select'); if (f) f.focus();
    return form;
  }

  /* ---- actions available on each document ---- */
  function actionsFor(d) {
    var base = (ACT[d.type] && ACT[d.type][d.status]) || [], lines = d.lines && d.lines.length;
    if (!lines) {
      if (d.type === 'DN' && d.status === 'pronta') return [{ to: 'spedita', l: ['Spedita alla nave', 'Shipped to vessel'] }];
      return base;
    }
    if (d.type === 'RQ') {
      var rfqs = children(d.id).filter(function (x) { return x.type === 'RFQ'; });
      if (d.status === 'verifica') return [{ to: 'quotazione', l: ['Richiedi quotazioni ai fornitori', 'Request quotations'], form: 'rfq' }];
      if (d.status === 'quotazione' || d.status === 'quotata') {
        var a = [];
        if (d.award && Object.keys(d.award).length) a.push({ to: 'ordinata', l: ['Crea gli ordini dalla scelta', 'Create orders from selection'], form: 'orders' });
        else a.push({ to: 'quotata', l: ['Scegli le offerte nella comparazione', 'Pick offers in the comparison'], form: 'scroll' });
        a.push({ to: 'quotazione', l: ['Aggiungi un fornitore', 'Add a supplier'], form: 'rfq', sec: 1 });
        return a;
      }
      if (d.status === 'ordinata') {
        var open = docs(function (x) { return x.from && x.from[0] && byId(x.from[0]) && byId(x.from[0]).from && byId(x.from[0]).from[0] === d.id && x.type === 'PO'; });
        return base;
      }
      return base;
    }
    if (d.type === 'RFQ') {
      if (d.status === 'creata') return [{ to: 'inviata', l: ['Prepara email e invia', 'Prepare email and send'], form: 'mail' }];
      if (d.status === 'inviata') return [{ to: 'quotata', l: ['Registra offerta', 'Record offer'], form: 'offer2' }, { to: 'rifiutata', l: ['Il fornitore non quota', 'Vendor declines'], sec: 1 }];
      if (d.status === 'quotata') { var rq = d.from && byId(d.from[0]); return rq ? [{ to: 'quotata', l: ['Vai alla comparazione', 'Go to comparison'], form: 'gorq' }] : []; }
    }
    if (d.type === 'PO') {
      if (d.status === 'bozza') return [{ to: 'approvato', l: ['Approva ordine', 'Approve order'], form: 'approve' }];
      if (d.status === 'approvato') return [{ to: 'inviato', l: ['Prepara email e invia', 'Prepare email and send'], form: 'mail' }];
      var rs = d.needResend ? [{ to: d.status, l: ['Rimanda Rev. ' + d.rev + ' al fornitore', 'Resend Rev. ' + d.rev + ' to supplier'], form: 'mail', sec: d.status === 'finalizzato' ? 0 : 1 }] : [];
      if (d.status === 'finalizzato') return rs.concat(poResidual(d).some(function (x) { return x > 0; }) ? [{ to: 'finalizzato', l: ['Merce pronta: crea consegna (DN)', 'Goods ready: create delivery note'], form: 'dn', sec: d.needResend ? 1 : 0 }] : []);
      return base.concat(rs);
    }
    if (d.type === 'DN') {
      if (d.status === 'pronta') return d.route === 'hub' ? [{ to: 'hub', l: ['Arrivata in hub', 'Arrived at hub'] }, { to: 'spedita', l: ['Spedita direttamente a bordo', 'Shipped direct to vessel'], sec: 1 }] : [{ to: 'spedita', l: ['Spedita a bordo', 'Shipped to vessel'] }];
      if (d.status === 'hub') return [{ to: 'spedita', l: ['Partita dall\'hub verso la nave', 'Left hub for the vessel'] }];
      if (d.status === 'ricevuta') return children(d.id).some(function (x) { return x.type === 'FT'; }) ? [] : [{ to: 'ricevuta', l: ['Registra fattura fornitore', 'Book supplier invoice'], form: 'ft', acc: 1 }];
      return base;
    }
    if (d.type === 'FT' && d.status === 'registrata') return [{ to: 'pagata', l: ['Segna come pagata', 'Mark as paid'], acc: 1 }];
    return base;
  }

  /* ---- requisition editor ---- */
  function rqEditor(d) {
    var rows = d.lines.map(function (l, i) {
      return '<tr><td class="j">' + l.row + '</td>' +
        '<td><input class="j" data-edit="' + i + '|impa" value="' + esc(l.impa || '') + '" style="width:90px" aria-label="IMPA"></td>' +
        '<td><input data-edit="' + i + '|desc" value="' + esc(l.desc) + '" style="width:100%" aria-label="' + esc(t('c_desc')) + '"><input data-edit="' + i + '|note" value="' + esc(l.note || '') + '" placeholder="P/N, maker, note" style="width:100%;margin-top:4px;font-size:12px" aria-label="note"></td>' +
        '<td><input data-edit="' + i + '|asset" value="' + esc(l.asset || '') + '" style="width:150px" aria-label="Asset"></td>' +
        '<td><input class="j" data-edit="' + i + '|qty" value="' + nf(l.qty) + '" inputmode="decimal" style="width:80px;text-align:right" aria-label="' + esc(t('l_qty')) + '"></td>' +
        '<td><input data-edit="' + i + '|uom" value="' + esc(l.uom || 'PCE') + '" style="width:62px" aria-label="' + esc(t('l_uom')) + '"></td>' +
        '<td><button type="button" class="btn sm ghost" data-act="delline" data-i="' + i + '" aria-label="' + esc(L2(['Elimina riga', 'Delete row'])) + ' ' + l.row + '">✕</button></td></tr>';
    }).join('');
    var opts = (DB.items || []).map(function (it) { return '<option value="' + esc((it.impa ? it.impa + ' · ' : '') + it.desc) + '"></option>'; }).join('');
    return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><h2>' + esc(t('lines')) + ' <span class="j mute">' + d.lines.length + '</span></h2><span class="mute" style="font-size:12px">' + esc(L2(['Modificabile fino alla richiesta di quotazione · salvataggio automatico', 'Editable until quotations are requested · saved automatically'])) + '</span></div>' +
      '<div class="tablebox"><table class="grid edit"><thead><tr><th>' + esc(t('l_row')) + '</th><th>IMPA</th><th>' + esc(t('c_desc')) + '</th><th>Asset</th><th class="num">' + esc(t('l_qty')) + '</th><th>' + esc(t('l_uom')) + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="filters"><input id="additem" list="itemlist" placeholder="' + esc(L2(['Aggiungi da anagrafica: IMPA o descrizione', 'Add from catalogue: IMPA or description'])) + '" style="flex:1;min-width:260px" aria-label="' + esc(L2(['Aggiungi articolo', 'Add item'])) + '"><datalist id="itemlist">' + opts + '</datalist>' +
      '<button type="button" class="btn" data-act="addline">' + esc(L2(['Aggiungi riga', 'Add row'])) + '</button></div></section>';
  }
  function curDoc() { var r = route(); return r.seg[0] === 'doc' ? byId(r.seg[1]) : null; }
  function editLine(el) {
    var d = curDoc(); if (!d || !UI.edit || UI.edit.id !== d.id) return;
    var p = el.getAttribute('data-edit').split('|'), l = d.lines[+p[0]], f = p[1];
    l[f] = /^(qty|price|d1)$/.test(f) ? Math.max(0, parseNum(el.value)) : el.value.trim();
    if (f === 'impa') l.code = l.impa;
    if (d.type === 'PO' && /^(qty|price|d1)$/.test(f)) { l.net = Math.round(l.qty * l.price * disc(l) * 100) / 100; d.total = docTotal(d); }
    UI.edit.dirty = true;
  }

  /* ---- comparison & award ---- */
  function rfqLine(rfq, row) { for (var i = 0; i < rfq.lines.length; i++) if (rfq.lines[i].src === row) return rfq.lines[i]; return null; }
  function offerEur(rfq, l) { return unitEur(rfq, l) * (l.oqty || l.qty); }
  function comparison(rq) {
    var rfqs = children(rq.id).filter(function (x) { return x.type === 'RFQ' && x.lines; });
    if (!rfqs.length) return '';
    var award = rq.award || {}, quoted = rfqs.filter(function (r) { return r.status === 'quotata'; });
    var best = {};
    rq.lines.forEach(function (l) {
      quoted.forEach(function (r) { var x = rfqLine(r, l.row); if (x && x.quoted) { var v = offerEur(r, x); if (best[l.row] == null || v < best[l.row]) best[l.row] = v; } });
    });
    var cols = rfqs.length;
    var head = '<div style="padding:6px 4px;font-size:12px" class="mute">' + esc(t('l_row')) + '</div>' + rfqs.map(function (r) {
      return '<div style="padding:6px 4px;display:flex;flex-direction:column;gap:4px;align-items:flex-start"><a href="#/doc/' + r.id + '" style="font-weight:700;color:var(--ink);text-decoration:none">' + esc(supName(r.sup)) + '</a><span class="j mute" style="font-size:11px">' + esc(r.num) + ' · ' + esc(r.cur) + (r.offer && r.offer.incoterm ? ' · ' + esc(r.offer.incoterm + (r.offer.place ? ' ' + r.offer.place : '')) : '') + '</span>' + chip(r) +
        (r.status === 'quotata' ? '<button type="button" class="btn sm" data-act="awardall" data-rfq="' + r.id + '">' + esc(L2(['Scegli tutta l\'offerta', 'Pick whole offer'])) + '</button>' : '') + '</div>';
    }).join('');
    var body = rq.lines.map(function (l) {
      return '<div style="border-top:1px solid var(--line);padding:10px 4px;display:flex;flex-direction:column;gap:2px"><div><span class="j mute" style="margin-right:6px">' + l.row + '</span><b>' + esc(l.desc) + '</b></div><div class="mute" style="font-size:12px">' + esc(l.note || '') + '</div><div class="j" style="font-size:12px">' + nf(l.qty) + ' ' + esc(l.uom) + '</div></div>' +
        rfqs.map(function (r) {
          var x = rfqLine(r, l.row);
          if (r.status !== 'quotata' || !x) return '<div class="cmp-cell off" style="margin-top:8px"><span class="mute" style="font-size:12px">' + esc(r.status === 'rifiutata' ? L2(['Non quota', 'Declined']) : L2(['In attesa di offerta', 'Awaiting offer'])) + '</span></div>';
          if (!x.quoted) return '<div class="cmp-cell off" style="margin-top:8px"><span class="mute" style="font-size:12px">' + esc(L2(['Non quotato', 'Not quoted'])) + '</span></div>';
          var v = offerEur(r, x), on = award[l.row] === r.id;
          return '<button type="button" class="cmp-cell' + (on ? ' on' : '') + '" data-act="award" data-row="' + l.row + '" data-rfq="' + r.id + '" aria-pressed="' + on + '" style="margin-top:8px">' +
            '<span style="display:flex;justify-content:space-between;gap:6px"><span class="j" style="font-weight:600">' + money(x.net, r.cur) + '</span><span style="font-size:11px;font-weight:800;color:var(--accText)">' + (on ? esc(L2(['SCELTA', 'SELECTED'])) : '') + '</span></span>' +
            '<span class="j mute" style="font-size:11px">' + nf(x.price) + (x.d1 ? ' −' + nf(x.d1, 0) + '%' : '') + ' /' + esc(l.uom) + ' · ≈ ' + (r.cur === 'USD' ? money(v, 'EUR') : money(v * fx(), 'USD')) + '</span>' +
            '<span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' + condChip(x.cond) + '<span class="j" style="font-size:11px">' + (x.days != null ? x.days + ' gg' : '') + '</span>' + (Math.abs(v - best[l.row]) < 0.005 ? '<span style="font-size:11px;font-weight:700;color:var(--teal)">' + esc(L2(['miglior prezzo', 'best price'])) + '</span>' : '') + '</span>' +
            '<span class="mute" style="font-size:12px">' + esc(x.origin || '') + (x.oqty && x.oqty !== l.qty ? ' · ' + esc(L2(['offre', 'offers'])) + ' ' + nf(x.oqty) : '') + '</span></button>';
        }).join('');
    }).join('');
    var foot = '<div style="border-top:2px solid var(--ink);padding:10px 4px;font-weight:800">' + esc(L2(['Totale offerta', 'Offer total'])) + '</div>' + rfqs.map(function (r) {
      if (r.status !== 'quotata') return '<div style="border-top:2px solid var(--ink)"></div>';
      var cov = r.lines.filter(function (x) { return x.quoted; }).length;
      return '<div style="border-top:2px solid var(--ink);padding:10px 4px;display:flex;flex-direction:column;gap:2px"><span class="j" style="font-weight:600">' + money(r.total, r.cur) + '</span><span class="j mute" style="font-size:11px">≈ ' + (r.cur === 'USD' ? money(toEur(r.total, 'USD'), 'EUR') : money(toUsd(r.total, 'EUR'), 'USD')) + '</span><span style="font-size:12px">' + esc(L2(['copertura', 'coverage'])) + ' ' + cov + '/' + r.lines.length + ((r.charges || []).some(function (c) { return c.amount; }) ? ' · ' + esc(L2(['spese incluse', 'charges incl.'])) : '') + '</span>' + (r.offer ? '<span class="mute" style="font-size:11px">' + esc(L2(['valida fino al', 'valid until'])) + ' ' + fd(r.offer.validTo) + '</span>' : '') + '</div>';
    }).join('');
    var sum = {}, totE = 0;
    Object.keys(award).forEach(function (row) {
      var r = byId(award[row]); if (!r) return; var x = rfqLine(r, +row); if (!x) return;
      var e = offerEur(r, x); totE += e; (sum[r.id] = sum[r.id] || { n: 0, e: 0, r: r }).n++; sum[r.id].e += e;
    });
    var aw = Object.keys(sum).map(function (k) { return '<span>' + esc(supName(sum[k].r.sup)) + ' · ' + sum[k].n + ' ' + esc(L2(['righe', 'rows'])) + ' · <span class="j">' + money(sum[k].e, 'EUR') + '</span></span>'; }).join('');
    return '<section class="card stack" id="cmp"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px"><h2>' + esc(L2(['Comparazione offerte', 'Quotation comparison'])) + ' <span class="j mute">' + quoted.length + '/' + rfqs.length + '</span></h2>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-act="preset" data-k="price">' + esc(L2(['Miglior prezzo', 'Best price'])) + '</button><button type="button" class="btn sm" data-act="preset" data-k="genuine">' + esc(L2(['Miglior prezzo Genuine', 'Best Genuine price'])) + '</button><button type="button" class="btn sm" data-act="preset" data-k="fast">' + esc(L2(['Consegna più rapida', 'Fastest delivery'])) + '</button><button type="button" class="btn sm ghost" data-act="preset" data-k="none">' + esc(L2(['Azzera', 'Clear'])) + '</button></div></div>' +
      '<div style="overflow-x:auto"><div class="cmp" style="min-width:' + (180 + cols * 165) + 'px;grid-template-columns:minmax(170px,1.1fr) repeat(' + cols + ',minmax(160px,1fr))">' + head + body + foot + '</div></div>' +
      (totE ? '<div class="note" style="display:flex;flex-wrap:wrap;gap:6px 22px;color:var(--ink)"><b>' + esc(L2(['Scelta', 'Selection'])) + '</b>' + aw + '<b class="j">' + money(totE, 'EUR') + ' · ' + money(totE * fx(), 'USD') + '</b></div>' : '<div class="mute" style="font-size:12px">' + esc(L2(['Clicca un\'offerta per sceglierla riga per riga, oppure usa una proposta automatica.', 'Click an offer to pick it row by row, or use an automatic proposal.'])) + '</div>') + '</section>';
  }
  function preset(rq, k) {
    var rfqs = children(rq.id).filter(function (x) { return x.type === 'RFQ' && x.status === 'quotata' && x.lines; });
    rq.award = {};
    if (k === 'none') return;
    rq.lines.forEach(function (l) {
      var bestR = null, bestV = null;
      rfqs.forEach(function (r) {
        var x = rfqLine(r, l.row); if (!x || !x.quoted) return;
        if (k === 'genuine' && x.cond !== 'Genuine') return;
        var v = k === 'fast' ? (x.days == null ? 999 : x.days) * 1e6 + offerEur(r, x) : offerEur(r, x);
        if (bestV == null || v < bestV) { bestV = v; bestR = r; }
      });
      if (bestR) rq.award[l.row] = bestR.id;
    });
  }

  /* ---- forms ---- */
  var FORMS = {
    scroll: function () { var el = document.getElementById('cmp'); if (el) el.scrollIntoView({ behavior: 'smooth' }); },
    gorq: function (d) { location.hash = '#/doc/' + d.from[0]; },
    rfq: function (rq) {
      var used = {}; children(rq.id).forEach(function (x) { if (x.type === 'RFQ') used[x.sup] = 1; });
      var cnt = {}; DB.docs.forEach(function (x) { if (x.sup && (x.type === 'RFQ' || x.type === 'PO')) cnt[x.sup] = (cnt[x.sup] || 0) + 1; });
      var sups = DB.suppliers.slice().sort(function (a, b) { return (cnt[b.id] || 0) - (cnt[a.id] || 0) || (a.name < b.name ? -1 : 1); });
      var list = sups.map(function (s) {
        return '<label class="suprow" data-name="' + esc(s.name.toUpperCase()) + '" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink);padding:5px 6px;border-radius:6px"><input type="checkbox" name="sup" value="' + esc(s.id) + '"' + (used[s.id] ? ' disabled' : '') + '> <span style="flex:1">' + esc(s.name) + '</span><span class="j mute" style="font-size:11px">' + s.cur + ' · ' + (cnt[s.id] || 0) + ' doc' + (used[s.id] ? ' · RFQ ✓' : '') + '</span></label>';
      }).join('');
      var lines = rq.lines.map(function (l) { return '<label style="flex-direction:row;gap:8px;color:var(--ink)"><input type="checkbox" name="ln" value="' + l.row + '" checked> <span class="j">' + l.row + '</span> ' + esc(l.desc) + ' · <span class="j">' + nf(l.qty) + ' ' + esc(l.uom) + '</span></label>'; }).join('');
      formModal(L2(['Richiedi quotazioni', 'Request quotations']) + ' · ' + rq.num,
        '<label>' + esc(L2(['Fornitori (una RFQ per fornitore, nella sua valuta)', 'Suppliers (one RFQ each, in its currency)'])) + '<input type="search" name="flt" placeholder="' + esc(t('filterTxt')) + '"></label>' +
        '<div style="max-height:34vh;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:4px">' + list + '</div>' +
        '<div class="stack" style="gap:4px"><span class="mute" style="font-size:13px">' + esc(t('lines')) + '</span>' + lines + '</div>' +
        '<label>' + esc(t('c_limit')) + '<input type="date" name="limit" value="' + addDays(TODAY, 7) + '"></label>',
        function (f) {
          var chosen = [].slice.call(f.querySelectorAll('input[name=sup]:checked')).map(function (x) { return x.value; });
          var rows = [].slice.call(f.querySelectorAll('input[name=ln]:checked')).map(function (x) { return +x.value; });
          if (!chosen.length || !rows.length) { toast(L2(['Scegli almeno un fornitore e una riga', 'Pick at least one supplier and one row'])); return false; }
          chosen.forEach(function (sid) {
            var sp = supById(sid);
            newDoc('RFQ', rq.ship, { status: 'creata', desc: rq.desc, sup: sid, cur: sp.cur || 'EUR', fx: fx(), dept: rq.dept, limit: f.elements.limit.value, due: rq.due, demo: rq.demo, from: [rq.id],
              lines: rq.lines.filter(function (l) { return rows.indexOf(l.row) >= 0; }).map(function (l) { return { row: l.row, src: l.row, item: l.item, code: l.code, impa: l.impa, desc: l.desc, note: l.note, uom: l.uom, qty: l.qty, asset: l.asset }; }) }, rq.num);
          });
          if (rq.status !== 'quotazione') setStatus(rq, 'quotazione', chosen.length + ' RFQ');
          else rq.log.push({ at: TODAY, to: 'quotazione', txt: '+' + chosen.length + ' RFQ' });
          save(); render(); toast(chosen.length + ' RFQ ' + L2(['create', 'created']));
        }, { w: 640, onInput: function (e, f) { if (e.target.name === 'flt') { var q = e.target.value.toUpperCase(); [].forEach.call(f.querySelectorAll('.suprow'), function (r) { r.hidden = q && r.getAttribute('data-name').indexOf(q) < 0; }); } } });
    },
    mail: function (d, to) {
      var sh = shipBy(d.ship), rq = d.from && byId(d.from[0]), sp = supById(d.sup) || {};
      var subj = 'M/V ' + sh.name + ' · ' + (d.type === 'RFQ' ? 'RFQ ' : 'PURCHASE ORDER ') + d.num + (d.rev ? ' REV. ' + d.rev : '') + (rq && d.type === 'RFQ' ? ' · ' + rq.num : '') + ' · ' + (sp.name || '');
      var rows = d.lines.map(function (l) {
        return l.row + '  ' + (l.impa ? 'IMPA ' + l.impa + '  ' : '') + l.desc + (l.note ? ' (' + l.note + ')' : '') + '  —  ' + nf(l.qty) + ' ' + l.uom +
          (d.type === 'PO' ? '  x ' + nf(l.price) + (l.d1 ? ' -' + nf(l.d1, 1) + '%' : '') + ' = ' + money(l.net, d.cur) + (l.cond ? '  [' + l.cond + ']' : '') : '');
      }).join('\n');
      var body = d.type === 'RFQ'
        ? 'Dear Sirs,\n\nPlease find below our Request for Quotation ' + d.num + ' for M/V ' + sh.name + '.\nKindly revert by ' + fd(d.limit) + ' with your best price, availability and delivery time, place of origin / stock and condition (Genuine, Non genuine or Reconditioned) for each item.\n\nThis inquiry is a request for quotation only and is NOT a purchase order. Kindly quote our RFQ number in all correspondence.\n\n' + rows + '\n\nBest regards'
        : 'Dear Sirs,\n\nPlease find below our Purchase Order ' + d.num + ' for M/V ' + sh.name + (d.offerRef ? ', as per your quotation ' + d.offerRef : '') + '.\nKindly confirm acceptance, delivery date and dispatch details by return.\n\n' + rows +
          (d.charges || []).filter(function (c) { return c.amount; }).map(function (c) { return '\n' + t('ch_' + c.kind) + ': ' + money(c.amount, d.cur); }).join('') + '\nTotal: ' + money(d.total, d.cur) +
          '\n\nAll items must be asbestos free as per SOLAS regulation II-1/3-5 and supplied with MD/SDoC.\nInvoice to be issued only after delivery on board and receipt of the signed delivery note.\n\nBest regards';
      formModal(L2(['Email al fornitore', 'Email to supplier']) + ' · ' + d.num,
        '<label>' + esc(L2(['A', 'To'])) + '<input name="to" type="email" value="' + esc(sp.email || '') + '" placeholder="email@fornitore"></label>' +
        '<label>' + esc(L2(['Oggetto', 'Subject'])) + '<input name="subj" value="' + esc(subj) + '"></label>' +
        '<label>' + esc(L2(['Testo', 'Body'])) + '<textarea name="body" rows="14" class="j" style="font-size:12px">' + esc(body) + '</textarea></label>' +
        '<div class="mute" style="font-size:12px">' + esc(L2(['Il prototipo non invia email: copia il testo in Outlook, poi segna il documento come inviato. La firma la aggiunge Outlook.', 'The prototype sends no email: copy the text into Outlook, then mark the document as sent.'])) + '</div>',
        function (f) {
          if (f.elements.to.value) sp.email = f.elements.to.value.trim();
          if (d.needResend && d.status === to) { d.needResend = false; d.log.push({ at: TODAY, to: to, txt: 'Rev. ' + d.rev + ' ' + L2(['rinviata', 'resent']) + (f.elements.to.value ? ' · ' + f.elements.to.value : '') }); }
          else setStatus(d, to, f.elements.to.value ? 'email ' + f.elements.to.value : 'email');
          if (d.type === 'RFQ') d.sentAt = TODAY;
          save(); render(); toast(L2(['Segnato come inviato', 'Marked as sent']));
        }, { w: 760, ok: L2(['Segna come inviato', 'Mark as sent']), extra: '<button type="button" class="btn" data-copy="1">' + esc(L2(['Copia testo', 'Copy text'])) + '</button>',
          onClick: function (e, f) {
            if (!e.target.getAttribute('data-copy')) return;
            var txt = f.elements.subj.value + '\n\n' + f.elements.body.value;
            try { navigator.clipboard.writeText(txt).then(function () { toast(L2(['Testo copiato', 'Text copied'])); }, function () { f.elements.body.select(); }); } catch (x) { f.elements.body.select(); }
          } });
    },
    offer2: function (d) {
      var rows = d.lines.map(function (l, i) {
        return '<tr><td class="j">' + l.row + '</td><td style="min-width:180px">' + esc(l.desc) + '<div class="mute j" style="font-size:11px">' + nf(l.qty) + ' ' + esc(l.uom) + '</div></td>' +
          '<td><input type="checkbox" name="qt' + i + '" checked aria-label="' + esc(L2(['Quotato', 'Quoted'])) + '"></td>' +
          '<td><input name="oq' + i + '" value="' + nf(l.qty) + '" inputmode="decimal" style="width:70px;text-align:right"></td>' +
          '<td><input name="pr' + i + '" value="" inputmode="decimal" style="width:90px;text-align:right" placeholder="0,00"></td>' +
          '<td><input name="dc' + i + '" value="" inputmode="decimal" style="width:52px;text-align:right" placeholder="%"></td>' +
          '<td><select name="cd' + i + '">' + CONDS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></td>' +
          '<td><input name="or' + i + '" value="" style="width:150px" placeholder="' + esc(L2(['Paese · stock', 'Country · stock'])) + '"></td>' +
          '<td><input name="dy' + i + '" value="" inputmode="numeric" style="width:52px;text-align:right" placeholder="gg"></td></tr>';
      }).join('');
      var sp = supById(d.sup) || {};
      formModal(L2(['Offerta di ', 'Offer from ']) + (sp.name || '') + ' · ' + d.num,
        '<div class="note stack" style="gap:8px;color:var(--ink)"><b>' + esc(L2(['Dati comuni a tutte le righe', 'Data common to all rows'])) + '</b><div class="filters">' +
        '<label>Incoterm<select name="inco">' + ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'DAP', 'DDP'].map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select></label>' +
        '<label>' + esc(L2(['Luogo di resa', 'Place'])) + '<input name="m_place" placeholder="' + esc(L2(['es. Napoli', 'e.g. Naples'])) + '"></label>' +
        '<label>' + esc(L2(['Lead time (gg)', 'Lead time (days)'])) + '<input name="m_days" inputmode="numeric" style="width:70px"></label>' +
        '<label>' + esc(L2(['Condizione', 'Condition'])) + '<select name="m_cond"><option value="">—</option>' + CONDS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></label>' +
        '<label>' + esc(L2(['Origine / stock', 'Origin / stock'])) + '<input name="m_orig"></label>' +
        '<label>' + esc(t('l_disc')) + ' %<input name="m_disc" inputmode="decimal" style="width:60px"></label>' +
        '<button type="button" class="btn" data-mass="1" style="align-self:flex-end">' + esc(L2(['Applica a tutte le righe', 'Apply to all rows'])) + '</button></div></div>' +
        '<div class="filters"><label>' + esc(t('currency')) + '<select name="cur"><option' + (d.cur === 'EUR' ? ' selected' : '') + '>EUR</option><option' + (d.cur === 'USD' ? ' selected' : '') + '>USD</option></select></label>' +
        '<label>' + esc(t('extRef')) + '<input name="ref" value=""></label><label>' + esc(t('validDays')) + '<input name="days" value="30" inputmode="numeric" style="width:70px"></label></div>' +
        '<div class="tablebox"><table class="grid edit" style="min-width:860px"><thead><tr><th>' + esc(t('l_row')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(L2(['Quot.', 'Quoted'])) + '</th><th class="num">' + esc(L2(['Q.tà off.', 'Qty off.'])) + '</th><th class="num">' + esc(L2(['Prezzo unit.', 'Unit price'])) + '</th><th class="num">' + esc(t('l_disc')) + '</th><th>' + esc(L2(['Condizione', 'Condition'])) + '</th><th>' + esc(L2(['Origine / stock', 'Origin / stock'])) + '</th><th class="num">' + esc(L2(['Gg cons.', 'Days'])) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<div class="filters"><label>' + esc(t('ch_transport')) + '<input name="ch_transport" value="" inputmode="decimal" style="width:90px"></label><label>' + esc(t('ch_packing')) + '<input name="ch_packing" value="" inputmode="decimal" style="width:90px"></label><label>' + esc(t('ch_other')) + '<input name="ch_other" value="" inputmode="decimal" style="width:90px"></label></div>',
        function (f) {
          var any = false;
          d.cur = f.elements.cur.value;
          d.lines.forEach(function (l, i) {
            l.quoted = f.elements['qt' + i].checked && parseNum(f.elements['pr' + i].value) > 0;
            l.oqty = parseNum(f.elements['oq' + i].value) || l.qty; l.price = parseNum(f.elements['pr' + i].value); l.d1 = parseNum(f.elements['dc' + i].value); l.d2 = 0;
            l.cond = f.elements['cd' + i].value; l.origin = f.elements['or' + i].value.trim(); l.days = f.elements['dy' + i].value === '' ? null : parseInt(f.elements['dy' + i].value, 10);
            l.net = l.quoted ? Math.round(l.oqty * l.price * disc(l) * 100) / 100 : 0;
            if (l.quoted) any = true;
          });
          if (!any) { toast(L2(['Inserisci almeno un prezzo', 'Enter at least one price'])); return false; }
          d.charges = ['transport', 'packing', 'other'].map(function (k) { return { kind: k, amount: parseNum(f.elements['ch_' + k].value) }; }).filter(function (c) { return c.amount; });
          d.total = docTotal(d);
          var days = parseInt(f.elements.days.value, 10) || 30;
          d.offer = { ref: f.elements.ref.value.trim(), date: TODAY, days: days, validTo: addDays(TODAY, days), incoterm: f.elements.inco.value, place: f.elements.m_place.value.trim() };
          setStatus(d, 'quotata', money(d.total, d.cur));
          var rq = byId(d.from[0]);
          if (rq && rq.status === 'quotazione' && !children(rq.id).some(function (x) { return x.type === 'RFQ' && (x.status === 'creata' || x.status === 'inviata'); })) setStatus(rq, 'quotata', L2(['tutte le offerte ricevute', 'all offers received']));
          save(); render(); toast(L2(['Offerta registrata', 'Offer recorded']));
        }, { w: 1000, extra: d.demo ? '<button type="button" class="btn" data-fill="1">' + esc(L2(['Compila offerta di esempio', 'Fill sample offer'])) + '</button>' : '',
          onClick: function (e, f) {
            if (e.target.getAttribute('data-fill')) demoFill(d, f);
            if (e.target.getAttribute('data-mass')) {
              var E = f.elements, place = E.m_place.value.trim();
              d.lines.forEach(function (l, i) {
                if (E.m_days.value !== '') E['dy' + i].value = E.m_days.value;
                if (E.m_cond.value) E['cd' + i].value = E.m_cond.value;
                if (E.m_orig.value || place) E['or' + i].value = (E.m_orig.value || '') + (place ? (E.m_orig.value ? ' · ' : '') + E.inco.value + ' ' + place : '');
                if (E.m_disc.value !== '') E['dc' + i].value = E.m_disc.value;
              });
              toast(L2(['Applicato a ', 'Applied to ']) + d.lines.length + ' ' + L2(['righe', 'rows']));
            }
          } });
    },
    orders: function (rq) {
      var award = rq.award || {}, by = {};
      Object.keys(award).forEach(function (row) { var r = byId(award[row]); if (r) (by[r.id] = by[r.id] || { r: r, rows: [] }).rows.push(+row); });
      var list = Object.keys(by).map(function (k) {
        var r = by[k].r, tot = by[k].rows.reduce(function (a, row) { var x = rfqLine(r, row); return a + (x ? x.net : 0); }, 0);
        return '<div style="display:flex;justify-content:space-between;gap:8px"><span>' + esc(supName(r.sup)) + ' · ' + by[k].rows.length + ' ' + esc(L2(['righe', 'rows'])) + '</span><span class="j">' + money(tot, r.cur) + '</span></div>';
      }).join('');
      var missing = rq.lines.filter(function (l) { return !award[l.row]; });
      formModal(L2(['Crea ordini da approvare', 'Create orders for approval']),
        '<div class="stack" style="gap:6px">' + list + '</div>' + (missing.length ? '<div class="note">' + esc(L2(['Righe senza scelta, restano aperte sulla richiesta: ', 'Rows without selection stay open: '])) + missing.map(function (l) { return l.row; }).join(', ') + '</div>' : '') +
        '<div class="mute" style="font-size:12px">' + esc(L2(['Un ordine in bozza per fornitore. Le spese dell\'offerta (trasporto, imballo) passano sull\'ordine. Le RFQ non scelte restano in archivio.', 'One draft order per supplier. Offer charges carry over. RFQs not selected stay on file.'])) + '</div>',
        function () {
          var made = [];
          Object.keys(by).forEach(function (k) {
            var r = by[k].r, n = 0;
            var lines = by[k].rows.sort(function (a, b) { return a - b; }).map(function (row) {
              var x = rfqLine(r, row); n += 10;
              return cloneLine(x, { row: n, src: x.row, rqRow: row, qty: x.oqty || x.qty, due: x.days != null ? addDays(TODAY, x.days) : rq.due, quoted: true });
            });
            var po = newDoc('PO', rq.ship, { status: 'bozza', desc: rq.desc, sup: r.sup, cur: r.cur, fx: r.fx || fx(), dept: rq.dept, prio: rq.prio, demo: rq.demo, from: [r.id], lines: lines,
              charges: (r.charges || []).map(function (c) { return { kind: c.kind, amount: c.amount }; }), offerRef: r.offer && r.offer.ref, terms: 'Material delivery within ' + Math.max.apply(null, lines.map(function (l) { return l.days || 0; })) + ' days from PO date', mdsdoc: true,
              due: lines.reduce(function (m, l) { return l.due && l.due > m ? l.due : m; }, '') || rq.due }, r.num);
            po.total = docTotal(po); made.push(po);
            r.awarded = true;
          });
          setStatus(rq, 'ordinata', made.map(function (p) { return p.num; }).join(', '));
          save(); render(); toast(made.length + ' ' + L2(['ordini in bozza creati', 'draft orders created']));
        }, { ok: L2(['Crea ordini', 'Create orders']) });
    },
    approve: function (po) {
      var pa = postable(po.ship), pref = po.dept === 'DECK' ? '00-2-' : '00-3-', B = budgetAgg(po.ship);
      var def = po.account || (pa.filter(function (a) { return a.path.indexOf(pref) === 0; })[0] || pa[0] || {}).path;
      var poE = toEur(po.total, po.cur);
      function impact(acc) {
        var v = B[acc] || { b: 0, o: 0, d: 0 }, before = v.b - v.o - v.d;
        if (!v.b) return '<span class="t-warn">' + esc(L2(['Conto senza budget: la spesa finisce fuori budget.', 'Account without budget: spend goes off budget.'])) + '</span>';
        return '<div class="kv"><dt>' + esc(t('b_budget')) + '</dt><dd class="j">' + money(v.b, 'EUR') + '</dd><dt>' + esc(L2(['Ordinato + consegnato', 'Ordered + delivered'])) + '</dt><dd class="j">' + money(v.o + v.d, 'EUR') + '</dd>' +
          '<dt>' + esc(L2(['Questo ordine', 'This order'])) + '</dt><dd class="j">' + money(poE, 'EUR') + '</dd><dt><b>' + esc(L2(['Residuo dopo', 'Remaining after'])) + '</b></dt><dd class="j ' + (before - poE < 0 ? 't-bad' : 't-ok') + '"><b>' + money(before - poE, 'EUR') + '</b></dd></div>';
      }
      formModal(t('appr') + ' · ' + po.num,
        '<div class="kv"><dt>' + esc(t('c_sup')) + '</dt><dd>' + esc(supName(po.sup)) + '</dd><dt>' + esc(t('c_total')) + '</dt><dd class="j">' + money(po.total, po.cur) + ' · ≈ ' + money(poE, 'EUR') + '</dd></div>' +
        '<label>' + esc(L2(['Conto di budget', 'Budget account'])) + '<select name="acc">' + acctOptions(po.ship, def) + '</select></label><div id="impact" class="note" style="color:var(--ink)">' + impact(def) + '</div>' +
        '<label>' + esc(t('note')) + '<textarea name="note" rows="2"></textarea></label>' +
        '<div class="mute" style="font-size:12px">' + esc(L2(['Approva chiunque: resta traccia di data e nota nella cronologia.', 'Anyone can approve: date and note stay in the history.'])) + '</div>',
        function (f) { po.account = f.elements.acc.value; setStatus(po, 'approvato', po.account + (f.elements.note.value ? ' · ' + f.elements.note.value : '')); save(); render(); toast(L2(['Ordine approvato', 'Order approved'])); },
        { w: 620, ok: L2(['Approva', 'Approve']), onInput: function (e, f) { if (e.target.name === 'acc') f.querySelector('#impact').innerHTML = impact(e.target.value); } });
      var sel = document.querySelector('.modal select[name=acc]'); if (sel) sel.addEventListener('change', function () { document.getElementById('impact').innerHTML = impact(sel.value); });
    },
    dn: function (po) {
      var res = poResidual(po);
      var rows = po.lines.map(function (l, i) {
        return res[i] > 0 ? '<tr><td class="j">' + l.row + '</td><td>' + esc(l.desc) + '</td><td class="num j">' + nf(res[i]) + ' ' + esc(l.uom) + '</td><td><input name="q' + i + '" value="' + nf(res[i]) + '" inputmode="decimal" style="width:80px;text-align:right"></td></tr>' : '';
      }).join('');
      formModal(L2(['Merce pronta · nuova consegna', 'Goods ready · new delivery']) + ' · ' + po.num,
        '<div class="tablebox"><table class="grid edit" style="min-width:520px"><thead><tr><th>' + esc(t('l_row')) + '</th><th>' + esc(t('c_desc')) + '</th><th class="num">' + esc(t('l_res')) + '</th><th>' + esc(L2(['Da spedire', 'To ship'])) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<label>' + esc(L2(['Percorso', 'Route'])) + '<select name="route"><option value="hub">' + esc(L2(['Via hub spedizioniere', 'Via forwarder hub'])) + '</option><option value="direct">' + esc(L2(['Diretta a bordo (porto vicino)', 'Direct to vessel (nearby port)'])) + '</option></select></label>' +
        '<label>' + esc(L2(['Hub / luogo di ritiro', 'Hub / pickup place'])) + '<input name="hub" value="' + esc(DB.meta.demo ? 'Hub spedizioniere' : 'TAILOR MADE LOGISTIC') + '"></label>' +
        '<label>' + esc(L2(['Porto di consegna a bordo', 'Port of delivery on board'])) + '<input name="port" value=""></label>' +
        '<label>' + esc(L2(['Arrivo a bordo previsto', 'Expected on board'])) + '<input type="date" name="eta" value="' + addDays(TODAY, 10) + '"></label>',
        function (f) {
          var lines = [];
          po.lines.forEach(function (l, i) { if (res[i] > 0) { var q = Math.min(res[i], parseNum(f.elements['q' + i].value)); if (q > 0) lines.push({ row: l.row, src: l.row, item: l.item, code: l.code, impa: l.impa, desc: l.desc, note: l.note, uom: l.uom, qty: q, recv: null, cond: l.cond }); } });
          if (!lines.length) { toast(L2(['Nessuna quantità da spedire', 'Nothing to ship'])); return false; }
          var route = f.elements.route.value, hub = f.elements.hub.value.trim(), port = f.elements.port.value.trim();
          var dn = newDoc('DN', po.ship, { status: 'pronta', desc: po.desc, sup: po.sup, dept: po.dept, demo: po.demo, from: [po.id], lines: lines, route: route, hub: hub, port: port, due: f.elements.eta.value,
            deliverTo: (route === 'hub' ? hub : L2(['Diretta a bordo', 'Direct on board'])) + (port ? ' → ' + port : ''), terms: 'Dispatch Instructions' }, po.num);
          save(); location.hash = '#/doc/' + dn.id; toast(L2(['Consegna creata', 'Delivery created']));
        }, { w: 700, ok: L2(['Crea consegna', 'Create delivery']) });
    },
    ft: function (dn) {
      var po = byId(dn.from[0]); if (!po || !po.lines) { toast('PO ?'); return; }
      var goods = 0, lines = [];
      dn.lines.forEach(function (l) {
        var pl = po.lines.filter(function (x) { return x.row === l.src; })[0]; if (!pl || !l.recv) return;
        var net = Math.round(l.recv * pl.price * disc(pl) * 100) / 100; goods += net;
        lines.push(cloneLine(pl, { qty: l.recv, net: net }));
      });
      goods = Math.round(goods * 100) / 100;
      var accDef = DB.accounts.some(function (a) { return a.path === '00-13--1301'; }) ? '00-13--1301' : po.account;
      var kinds = ['transport', 'hub', 'customs', 'bank', 'other'];
      var chRows = kinds.map(function (k) { return '<tr><td>' + esc(t('ch_' + k)) + '</td><td><input name="a_' + k + '" inputmode="decimal" style="width:100px;text-align:right" placeholder="0,00"></td><td><select name="c_' + k + '">' + acctOptions(po.ship, k === 'bank' ? po.account : accDef) + '</select></td></tr>'; }).join('');
      formModal(L2(['Fattura fornitore', 'Supplier invoice']) + ' · ' + supName(po.sup),
        '<div class="filters"><label>' + esc(L2(['Numero fattura', 'Invoice number'])) + '<input name="num" required></label><label>' + esc(t('c_date')) + '<input type="date" name="date" value="' + TODAY + '"></label><label>' + esc(L2(['Pagamento (giorni)', 'Payment (days)'])) + '<input name="pay" value="60" inputmode="numeric" style="width:70px"></label></div>' +
        '<div class="kv"><dt>' + esc(L2(['Merce ricevuta da ordine', 'Received goods per order'])) + '</dt><dd class="j">' + money(goods, po.cur) + ' (' + esc(po.num) + ')</dd></div>' +
        '<label>' + esc(L2(['Merce fatturata', 'Invoiced goods'])) + ' (' + po.cur + ')<input name="goods" value="' + nf(goods) + '" inputmode="decimal"></label>' +
        '<div class="mute" style="font-size:13px">' + esc(L2(['Spese extra non presenti in offerta e ordine: vanno a budget sul conto scelto', 'Extra charges not in quote or order: booked to the chosen budget account'])) + '</div>' +
        '<div class="tablebox"><table class="grid edit" style="min-width:560px"><thead><tr><th>' + esc(L2(['Voce', 'Item'])) + '</th><th>' + esc(t('l_net')) + ' ' + po.cur + '</th><th>' + esc(L2(['Conto di budget', 'Budget account'])) + '</th></tr></thead><tbody>' + chRows + '</tbody></table></div>',
        function (f) {
          var ch = kinds.map(function (k) { return { kind: k, amount: parseNum(f.elements['a_' + k].value), account: f.elements['c_' + k].value }; }).filter(function (c) { return c.amount; });
          (po.charges || []).forEach(function (c) { if (c.amount) ch.unshift({ kind: c.kind, amount: c.amount, account: po.account, note: L2(['da ordine', 'per order']) }); });
          var gd = parseNum(f.elements.goods.value), date = f.elements.date.value || TODAY;
          var ft = newDoc('FT', dn.ship, { status: 'registrata', desc: dn.desc, sup: po.sup, cur: po.cur, fx: po.fx || fx(), dept: po.dept, demo: dn.demo, from: [dn.id], lines: lines,
            goods: gd, poGoods: goods, charges: ch, inv: { num: f.elements.num.value.trim(), date: date }, orig: f.elements.num.value.trim(), date: date, due: addDays(date, parseInt(f.elements.pay.value, 10) || 60) }, f.elements.num.value.trim());
          ft.total = Math.round((gd + ch.reduce(function (a, c) { return a + c.amount; }, 0)) * 100) / 100;
          save(); location.hash = '#/doc/' + ft.id; toast(L2(['Fattura registrata', 'Invoice booked']));
        }, { w: 720, ok: L2(['Registra fattura', 'Book invoice']) });
    }
  };
  function poResidual(po) {
    var shipped = {};
    docs(function (x) { return x.type === 'DN' && x.from && x.from[0] === po.id && x.lines; }).forEach(function (dn) { dn.lines.forEach(function (l) { shipped[l.src] = (shipped[l.src] || 0) + (dn.status === 'ricevuta' ? (l.recv || 0) : l.qty); }); });
    return po.lines.map(function (l) { return Math.max(0, l.qty - (shipped[l.row] || 0)); });
  }

  /* ---- demo case ---- */
  var DEMO_OFFERS = [
    { origin: ['Germania · stock Napoli', 'Germania · da produrre', 'Germania · stock Napoli'], cond: ['Genuine', 'Genuine', 'Genuine'], eur: [206, 1180, 48], days: [5, 21, 5], ch: { transport: 35 } },
    { origin: ['Cina · stock Dubai', 'Cina · stock Dubai', 'Cina · stock Dubai'], cond: ['Non genuine', 'Non genuine', 'Non genuine'], eur: [138.32, 705.53, 25.07], days: [12, 12, 12], ch: {} },
    { origin: ['Germania · stock Pireo', 'Ricondizionato · Pireo', null], cond: ['Genuine', 'Usato', null], eur: [182.5, 640, null], days: [8, 4, null], ch: { packing: 20 } }
  ];
  function demoFill(rfq, f) {
    var rq = byId(rfq.from[0]), idx = children(rq.id).filter(function (x) { return x.type === 'RFQ'; }).indexOf(rfq) % 3, o = DEMO_OFFERS[idx];
    var cur = f.elements.cur.value, k = cur === 'USD' ? fx() : 1;
    f.elements.ref.value = 'Q-' + (2600 + idx * 37) + '/26';
    rfq.lines.forEach(function (l, i) {
      var j = rq.lines.map(function (x) { return x.row; }).indexOf(l.src); if (j < 0 || j > 2) j = i % 3;
      var on = o.eur[j] != null;
      f.elements['qt' + i].checked = on;
      f.elements['pr' + i].value = on ? nf(o.eur[j] * k) : '';
      f.elements['cd' + i].value = o.cond[j] || 'Genuine';
      f.elements['or' + i].value = o.origin[j] || '';
      f.elements['dy' + i].value = o.days[j] != null ? o.days[j] : '';
    });
    ['transport', 'packing', 'other'].forEach(function (c) { f.elements['ch_' + c].value = o.ch[c] ? nf(o.ch[c] * k) : ''; });
  }
  function makeDemo() {
    var d = { id: 'DEMO-RQ', type: 'RQ', num: nextNum('MDT', 'RQ'), ship: 'MDT', desc: 'Ricambi pompa acqua mare raffreddamento n.1', status: 'endorsed', side: 'office', dept: 'ENG', prio: 'urgente',
      date: addDays(TODAY, -2), due: addDays(TODAY, 25), demo: true, proto: true, from: [],
      lines: [
        { row: 10, code: '', impa: '', desc: 'MECHANICAL SEAL', note: 'Cooling sea water pump No.1 · shaft 45 mm', uom: 'PCE', qty: 2, asset: 'SW cooling pump No.1' },
        { row: 20, code: '', impa: '', desc: 'IMPELLER', note: 'Cooling sea water pump No.1 · bronze', uom: 'PCE', qty: 1, asset: 'SW cooling pump No.1' },
        { row: 30, code: '', impa: '', desc: 'GASKET SET, PUMP CASING', note: 'Cooling sea water pump No.1', uom: 'SET', qty: 2, asset: 'SW cooling pump No.1' }],
      log: [{ at: addDays(TODAY, -3), to: 'bozza', txt: L2(['Bozza a bordo', 'Draft on board']) }, { at: addDays(TODAY, -2), to: 'endorsed', txt: L2(['Endorsed dal Direttore di macchina', 'Endorsed by Chief Engineer']) }] };
    DB.docs.push(d);
  }
  function ensureDemo() { if (!byId('DEMO-RQ')) { makeDemo(); save(); } }
  function resetDemo() {
    var ids = {}; DB.docs.forEach(function (d) { if (d.demo) ids[d.id] = 1; });
    DB.docs = DB.docs.filter(function (d) { return !d.demo; });
    DB.moves = (DB.moves || []).filter(function (m) { return !ids[m.doc]; });
    makeDemo(); save();
  }

  var CLICK = {
    newrq: function (a) {
      var nave = a.getAttribute('data-ship') || 'MDT';
      var shipOpts = DB.ships.map(function (s) { return '<option value="' + s.code + '"' + (s.code === nave ? ' selected' : '') + '>' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('');
      formModal(L2(['Nuova richiesta', 'New requisition']),
        '<label>' + esc(t('c_ship')) + '<select name="ship">' + shipOpts + '</select></label><label>' + esc(t('c_desc')) + '<input name="desc" required></label>' +
        '<div class="filters"><label>' + esc(t('c_dept')) + '<select name="dept"><option value="ENG">' + esc(t('ENG')) + '</option><option value="DECK">' + esc(t('DECK')) + '</option><option value="SAFETY">' + esc(t('SAFETY')) + '</option></select></label>' +
        '<label>' + esc(L2(['Priorità', 'Priority'])) + '<select name="prio">' + Object.keys(PRIO).map(function (k) { return '<option value="' + k + '">' + esc(L2(PRIO[k])) + '</option>'; }).join('') + '</select></label>' +
        '<label>' + esc(t('c_due')) + '<input type="date" name="due" value="' + addDays(TODAY, 30) + '"></label></div>',
        function (f) {
          var d = newDoc('RQ', f.elements.ship.value, { status: 'bozza', desc: f.elements.desc.value.trim(), dept: f.elements.dept.value, prio: f.elements.prio.value, due: f.elements.due.value, side: P.seat === 'ship' ? 'ship' : 'office', lines: [] });
          save(); UI.edit = { id: d.id, snap: JSON.parse(JSON.stringify(d)), dirty: false }; location.hash = '#/doc/' + d.id;
        }, { ok: L2(['Crea', 'Create']) });
    },
    addline: function () {
      var d = curDoc(); if (!d || !editable(d)) return;
      var v = (document.getElementById('additem') || {}).value || '', it = null;
      (DB.items || []).forEach(function (x) { if ((x.impa ? x.impa + ' · ' : '') + x.desc === v) it = x; });
      var row = d.lines.reduce(function (m, l) { return Math.max(m, l.row); }, 0) + 10;
      d.lines.push(it ? { row: row, item: it.id, code: it.code, impa: it.impa, desc: it.desc, note: '', uom: it.uom, qty: 1 } : { row: row, code: '', impa: '', desc: v.trim(), note: '', uom: 'PCE', qty: 1 });
      UI.edit.dirty = true; render();
    },
    delline: function (a) { var d = curDoc(); if (!d || !editable(d)) return; d.lines.splice(+a.getAttribute('data-i'), 1); UI.edit.dirty = true; render(); },
    award: function (a) {
      var d = curDoc(); if (!d) return; d.award = d.award || {};
      var row = a.getAttribute('data-row'), id = a.getAttribute('data-rfq');
      if (d.award[row] === id) delete d.award[row]; else d.award[row] = id;
      save(); render(); var el = document.getElementById('cmp'); if (el) el.scrollIntoView();
    },
    preset: function (a) { var d = curDoc(); if (!d) return; preset(d, a.getAttribute('data-k')); save(); render(); var el = document.getElementById('cmp'); if (el) el.scrollIntoView(); },
    demoreset: function () { resetDemo(); render(); toast(L2(['Pratica demo ripartita', 'Demo case restarted'])); }
  };


  /* ---------- group A: seats, edit mode, arrivals, accounting ---------- */
  function seatName() { return L2({ office: ['Ufficio acquisti', 'Purchasing office'], ship: ['Bordo', 'Vessel'], acc: ['Contabilità', 'Accounting'] }[P.seat] || ['Ufficio acquisti', 'Purchasing office']); }
  function locOf(ship, item) { return item && DB.loc ? DB.loc[ship + '|' + item] : ''; }
  function editHeader(d) {
    var pr = d.type === 'RQ' || d.type === 'PO';
    return '<div class="card stack" style="border-color:var(--acc)"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><b>' + esc(L2(['Modifica in corso', 'Editing'])) + '</b><span style="display:flex;gap:8px"><button class="btn" data-act="editcancel">' + esc(L2(['Annulla modifiche', 'Discard changes'])) + '</button><button class="btn pri" data-act="editsave">' + esc(L2(['Salva', 'Save'])) + '</button></span></div>' +
      '<label class="stack" style="gap:4px;font-size:13px;color:var(--mute)">' + esc(t('c_desc')) + '<input data-hedit="desc" value="' + esc(d.desc || '') + '" style="font-size:18px;font-weight:700;background:var(--bg);border:1px solid var(--line2);border-radius:8px;padding:8px 10px;color:var(--ink)"></label>' +
      '<div class="filters">' + (d.type !== 'FT' ? '<label class="stack" style="gap:4px;font-size:13px;color:var(--mute)">' + esc(d.type === 'DN' ? t('sc_dn') : t('c_due')) + '<input type="date" data-hedit="due" value="' + esc(d.due || '') + '"></label>' : '') +
      (pr ? '<label class="stack" style="gap:4px;font-size:13px;color:var(--mute)">' + esc(L2(['Priorità', 'Priority'])) + '<select data-hedit="prio">' + Object.keys(PRIO).map(function (k) { return '<option value="' + k + '"' + ((d.prio || 'normale') === k ? ' selected' : '') + '>' + esc(L2(PRIO[k])) + '</option>'; }).join('') + '</select></label>' : '') +
      (d.type === 'PO' ? '<label class="stack" style="gap:4px;font-size:13px;color:var(--mute);flex:1">' + esc(t('terms')) + '<input data-hedit="terms" value="' + esc(d.terms || '') + '"></label>' : '') + '</div>' +
      '<label class="stack" style="gap:4px;font-size:13px;color:var(--mute)">' + esc(t('note')) + '<textarea data-hedit="note" rows="2" style="background:var(--bg);border:1px solid var(--line2);border-radius:8px;padding:8px 10px;color:var(--ink)">' + esc(d.note || '') + '</textarea></label>' +
      (d.type === 'PO' && { inviato: 1, confermato: 1, finalizzato: 1 }[d.status] ? '<div class="note" style="color:var(--amber)">' + esc(L2(['Ordine già inviato: salvando nasce la Rev. ' + ((d.rev || 0) + 1) + ', da rimandare al fornitore.', 'Order already sent: saving creates Rev. ' + ((d.rev || 0) + 1) + ', to be resent to the supplier.'])) + '</div>' : '') +
      (d.type === 'RQ' && !linesOpen(d) ? '<div class="note">' + esc(L2(['Le righe sono bloccate perché le RFQ sono già partite.', 'Rows are locked because RFQs have been sent.'])) + '</div>' : '') + '</div>';
  }
  function poEditor(d) {
    var rows = d.lines.map(function (l, i) {
      return '<tr><td class="j">' + l.row + '</td><td>' + lineDesc(l) + '</td><td>' + esc(l.uom) + '</td>' +
        '<td><input class="j" data-edit="' + i + '|qty" value="' + nf(l.qty) + '" inputmode="decimal" style="width:80px;text-align:right"></td>' +
        '<td><input class="j" data-edit="' + i + '|price" value="' + nf(l.price) + '" inputmode="decimal" style="width:100px;text-align:right"></td>' +
        '<td><input class="j" data-edit="' + i + '|d1" value="' + nf(l.d1 || 0, 1) + '" inputmode="decimal" style="width:60px;text-align:right"></td>' +
        '<td><input type="date" data-edit="' + i + '|due" value="' + esc(l.due || '') + '"></td></tr>';
    }).join('');
    return '<section class="card stack"><h2>' + esc(t('lines')) + '</h2><div class="tablebox"><table class="grid edit"><thead><tr><th>' + esc(t('l_row')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(t('l_uom')) + '</th><th class="num">' + esc(t('l_qty')) + '</th><th class="num">' + esc(t('l_price')) + ' ' + esc(d.cur || '') + '</th><th class="num">' + esc(t('l_disc')) + ' %</th><th>' + esc(t('l_due')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
  }
  function diffDoc(a, b) {
    var ch = [];
    ['desc', 'due', 'prio', 'terms', 'note'].forEach(function (k) { if ((a[k] || '') !== (b[k] || '')) ch.push(k === 'desc' ? L2(['descrizione', 'description']) : k === 'due' ? L2(['data consegna', 'due date']) : k === 'prio' ? L2(['priorità', 'priority']) : k === 'terms' ? L2(['condizioni', 'terms']) : L2(['nota', 'note'])); });
    var al = a.lines || [], bl = b.lines || [];
    if (al.length !== bl.length) ch.push(L2(['righe ', 'rows ']) + al.length + ' → ' + bl.length);
    bl.forEach(function (l) {
      var o = al.filter(function (x) { return x.row === l.row; })[0]; if (!o) return;
      ['qty', 'price', 'd1', 'desc', 'impa', 'note', 'due', 'asset', 'uom'].forEach(function (k) { if (String(o[k] == null ? '' : o[k]) !== String(l[k] == null ? '' : l[k])) ch.push(L2(['riga ', 'row ']) + l.row + ' ' + k + (/qty|price|d1/.test(k) ? ' ' + nf(o[k] || 0) + ' → ' + nf(l[k] || 0) : '')); });
    });
    return ch;
  }
  function arrivals(ship) { return docs(function (d) { return d.ship === ship && d.type === 'DN' && isOpen(d) && d.lines && d.lines.length; }).sort(function (a, b) { return (a.due || '') < (b.due || '') ? -1 : 1; }); }
  function arrivalsTable(ship) {
    var a = arrivals(ship);
    if (!a.length) return '<div class="empty">' + esc(L2(['Nessuna consegna in arrivo con righe per questa nave.', 'No incoming deliveries with lines for this vessel.'])) + '</div>';
    return '<div class="note">' + esc(L2(['La merce entra in magazzino solo quando la nave conferma la DN firmata e indica le quantità ricevute e l\'ubicazione.', 'Goods enter stores only when the vessel confirms the signed DN with received quantities and location.'])) + '</div>' +
      '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('c_num')) + '</th><th>' + esc(t('c_sup')) + '</th><th>' + esc(t('c_desc')) + '</th><th class="num">' + esc(t('rows')) + '</th><th>' + esc(t('c_status')) + '</th><th>' + esc(t('sc_dn')) + '</th><th></th></tr></thead><tbody>' +
      a.map(function (d) {
        var btn = d.status === 'spedita' ? (P.seat === 'ship' ? '<button class="btn pri sm" data-act="recvdn" data-id="' + d.id + '">' + esc(L2(['Ricevi e carica', 'Receive and load'])) + '</button>' : '<span class="mute" style="font-size:12px">' + esc(L2(['da bordo', 'by vessel'])) + '</span>') : '<span class="mute" style="font-size:12px">' + esc(L2(['non ancora spedita', 'not shipped yet'])) + '</span>';
        return '<tr><td>' + COLS.num.v(d) + '</td><td>' + esc(supName(d.sup)) + '</td><td><a href="#/doc/' + d.id + '">' + esc(d.desc) + '</a></td><td class="num j">' + d.lines.length + '</td><td>' + chip(d) + '</td><td class="j' + (isLate(d) ? ' t-bad' : '') + '">' + fd(d.due) + '</td><td>' + btn + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function pageAcc(q) {
    var tab = q.tab || 'todo';
    var todo = docs(function (d) { return d.type === 'DN' && d.status === 'ricevuta' && d.from && byId(d.from[0]) && byId(d.from[0]).lines && !children(d.id).some(function (x) { return x.type === 'FT'; }); });
    var fts = docs(function (d) { return d.type === 'FT'; }).sort(function (a, b) { return (a.due || '') < (b.due || '') ? -1 : 1; });
    var tabs = '<nav class="tabs">' + [['todo', ['Da fatturare', 'To invoice'], todo.length], ['open', ['Fatture da pagare', 'Invoices to pay'], fts.filter(isOpen).length], ['all', ['Tutte le fatture', 'All invoices'], fts.length]].map(function (x) { return '<a class="' + (tab === x[0] ? 'on' : '') + '" href="#/contabilita' + qs({ tab: x[0] }) + '">' + esc(L2(x[1])) + '<span class="j">' + x[2] + '</span></a>'; }).join('') + '</nav>';
    var body;
    if (tab === 'todo') {
      body = todo.length ? '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('c_num')) + '</th><th>' + esc(t('c_ship')) + '</th><th>' + esc(t('c_sup')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(L2(['Ordine', 'Order'])) + '</th><th class="num">' + esc(L2(['Valore ricevuto', 'Received value'])) + '</th><th></th></tr></thead><tbody>' +
        todo.map(function (d) {
          var po = byId(d.from[0]), v = 0;
          d.lines.forEach(function (l) { var pl = po.lines.filter(function (x) { return x.row === l.src; })[0]; if (pl && l.recv) v += l.recv * pl.price * disc(pl); });
          return '<tr><td>' + COLS.num.v(d) + '</td><td>' + COLS.ship.v(d) + '</td><td>' + esc(supName(d.sup)) + '</td><td><a href="#/doc/' + d.id + '">' + esc(d.desc) + '</a></td><td class="j">' + esc(po.num) + '</td><td class="num j">' + money(v, po.cur) + '</td><td>' +
            (P.seat === 'acc' ? '<button class="btn pri sm" data-act="ftfor" data-id="' + d.id + '">' + esc(L2(['Registra fattura', 'Book invoice'])) + '</button>' : '<span class="mute" style="font-size:12px">' + esc(L2(['postazione Contabilità', 'Accounting station'])) + '</span>') + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty">' + esc(L2(['Nessuna consegna ricevuta in attesa di fattura.', 'No received delivery awaiting invoice.'])) + '</div>';
    } else body = gridTable(tab === 'open' ? fts.filter(isOpen) : fts, ['num', 'ship', 'desc', 'sup', 'status', 'total', 'eur', 'date', 'due'], null, null);
    var note = '<div class="note">' + esc(L2(['Le fatture si registrano dopo la DN timbrata e firmata da bordo. Le spese extra (trasporto, hub, dogana, banca) vanno sul conto di budget scelto. Gli acquisti vedono solo lo stato.', 'Invoices are booked after the DN is stamped and signed on board. Extra charges go to the chosen budget account. Purchasing only sees the status.'])) + '</div>';
    return shell('contabilita', crumb([[t('fleet'), '#/']]), L2(['Contabilità', 'Accounting']), (P.seat !== 'acc' ? '<div class="note" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' + esc(L2(['Stai guardando come ', 'Viewing as '])) + '<b>' + esc(seatName()) + '</b><button class="btn sm" data-act="seat" data-to="acc">' + esc(L2(['Passa a Contabilità', 'Switch to Accounting'])) + '</button></div>' : '') + tabs + body + note);
  }
  CLICK.editstart = function () { var d = curDoc(); if (!d) return; if (UI.edit && UI.edit.id !== d.id) { toast(L2(['Prima salva o annulla l\'altra modifica', 'Save or discard the other edit first'])); return; } UI.edit = { id: d.id, snap: JSON.parse(JSON.stringify(d)), dirty: false }; render(); };
  CLICK.editcancel = function () {
    var d = curDoc(); if (!d || !UI.edit) return;
    var i = DB.docs.indexOf(d); if (i >= 0) DB.docs[i] = UI.edit.snap;
    UI.edit = null; render(); toast(L2(['Modifiche annullate', 'Changes discarded']));
  };
  CLICK.editsave = function () {
    var d = curDoc(); if (!d || !UI.edit) return;
    var ch = diffDoc(UI.edit.snap, d);
    if (!ch.length) { UI.edit = null; render(); toast(L2(['Nessuna modifica', 'No changes'])); return; }
    if (d.type === 'PO' && d.lines) { d.total = docTotal(d); }
    var revd = d.type === 'PO' && { inviato: 1, confermato: 1, finalizzato: 1 }[d.status];
    if (revd) { d.rev = (d.rev || 0) + 1; d.needResend = true; }
    d.log = d.log || [];
    d.log.push({ at: TODAY, to: d.status, txt: (revd ? 'Rev. ' + d.rev + ' · ' : '') + L2(['Modificato: ', 'Edited: ']) + ch.slice(0, 6).join(', ') + (ch.length > 6 ? ' …' : '') });
    UI.edit = null; save(); render(); toast(L2(['Salvato', 'Saved']) + (revd ? ' · Rev. ' + d.rev : ''));
  };
  CLICK.awardall = function (a) {
    var d = curDoc(); if (!d) return; var r = byId(a.getAttribute('data-rfq')); d.award = d.award || {};
    r.lines.forEach(function (x) { if (x.quoted) d.award[x.src] = r.id; });
    save(); render(); var el = document.getElementById('cmp'); if (el) el.scrollIntoView();
  };
  CLICK.recvdn = function (a) { var d = byId(a.getAttribute('data-id')); if (d) receiveModal(d); };
  CLICK.ftfor = function (a) { var d = byId(a.getAttribute('data-id')); if (d) FORMS.ft(d); };


  /* ---------- group B: PDF documents and Outlook drafts ---------- */
  var TPL_DEF = {
    company: { name: '', address: '', phone: '', email: '', web: '' },
    invoiceTo: { name: '', address: '', email: '' },
    color: '#1f2328', logo: '', footer: '',
    RFQ: { title: 'REQUEST FOR QUOTATION', intro: 'Dear Sirs,\nKindly quote your best price, availability, delivery time, place of origin / stock and condition (Genuine, Non genuine or Reconditioned) for the items listed below. Please quote our RFQ number in all correspondence.',
      closing: 'This inquiry is a request for quotation only and is NOT a purchase order.', clauses: 'All items must be asbestos free as per SOLAS regulation II-1/3-5 and supplied with MD/SDoC.',
      cols: { impa: 1, note: 1, asset: 1, fill: 1 } },
    PO: { title: 'PURCHASE ORDER', intro: 'Dear Sirs,\nPlease supply the items listed below as per your quotation and the terms of this order. Kindly confirm acceptance and delivery date by return.',
      closing: 'Invoice to be issued only after delivery on board and receipt of the signed delivery note. Please quote our PO number on the invoice and on all documents.',
      clauses: 'All items must be asbestos free as per SOLAS regulation II-1/3-5 and supplied with MD/SDoC.\nEach package to be marked with vessel name and PO number.',
      cols: { impa: 1, note: 1, asset: 1, cond: 1, due: 1 } }
  };
  function tpl() {
    var s = DB.settings || {}, o = JSON.parse(JSON.stringify(TPL_DEF));
    ['company', 'invoiceTo'].forEach(function (k) { if (s[k]) for (var x in s[k]) o[k][x] = s[k][x]; });
    ['color', 'logo', 'footer'].forEach(function (k) { if (s[k] != null) o[k] = s[k]; });
    ['RFQ', 'PO'].forEach(function (k) { if (s[k]) { for (var x in s[k]) if (x !== 'cols') o[k][x] = s[k][x]; if (s[k].cols) o[k].cols = s[k].cols; } });
    return o;
  }
  var libP = null;
  function loadPdfLib() {
    if (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API.autoTable) return Promise.resolve();
    if (libP) return libP;
    function load(src) { return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { ko(new Error('load ' + src)); }; document.head.appendChild(s); }); }
    libP = load('lib/jspdf.umd.min.js').then(function () { return load('lib/jspdf.plugin.autotable.min.js'); });
    return libP;
  }
  function pdfTxt(s) { return String(s == null ? '' : s).replace(/[→]/g, '->').replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x00-\xFF€]/g, '?'); }
  function hexRgb(h) { h = (h || '#1f2328').replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function pdfMoney(v, cur) { return (v || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (cur === 'USD' ? ' USD' : ' EUR'); }
  function pdfDate(s) { return s ? fd(s) : '-'; }
  function buildPdf(d) {
    var T = tpl(), K = T[d.type], col = hexRgb(T.color), sh = shipBy(d.ship), sp = supById(d.sup) || {}, rq = null;
    var cur = d.from && d.from[0] ? byId(d.from[0]) : null; while (cur && cur.type !== 'RQ' && cur.from && cur.from[0]) cur = byId(cur.from[0]); if (cur && cur.type === 'RQ') rq = cur;
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, M = 14, y = 14;
    doc.setFont('helvetica', 'normal');
    // header
    var lx = M;
    if (T.logo) { try { var fmt = /^data:image\/png/.test(T.logo) ? 'PNG' : 'JPEG'; var p = doc.getImageProperties(T.logo), h = 16, w = Math.min(45, p.width * h / p.height); doc.addImage(T.logo, fmt, M, y - 2, w, h); lx = M + w + 4; } catch (e) {} }
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text(pdfTxt(T.company.name || ' '), lx, y + 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    var cl = [T.company.address, [T.company.phone ? 'Tel. ' + T.company.phone : '', T.company.email].filter(Boolean).join('  ·  '), T.company.web].filter(Boolean);
    cl.forEach(function (l, i) { doc.text(pdfTxt(l), lx, y + 6 + i * 3.6); });
    doc.setTextColor(col[0], col[1], col[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
    doc.text(pdfTxt(K.title), W - M, y + 2, { align: 'right' });
    doc.setTextColor(30, 30, 30); doc.setFontSize(10);
    doc.text(pdfTxt(d.num + (d.rev ? '  REV. ' + d.rev : '')), W - M, y + 8, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    doc.text(pdfTxt('Date ' + pdfDate(d.type === 'RFQ' ? (d.sentAt || TODAY) : TODAY)), W - M, y + 12.5, { align: 'right' });
    y += 22;
    doc.setDrawColor(col[0], col[1], col[2]); doc.setLineWidth(0.6); doc.line(M, y, W - M, y); y += 6;
    // boxes
    function box(x, w, title, lines) {
      doc.setFontSize(7.5); doc.setTextColor(110, 110, 110); doc.text(pdfTxt(title.toUpperCase()), x, y);
      doc.setTextColor(30, 30, 30); doc.setFontSize(9);
      var yy = y + 4.5; lines.forEach(function (l, i) { doc.setFont('helvetica', i === 0 ? 'bold' : 'normal'); var tl = doc.splitTextToSize(pdfTxt(l), w); doc.text(tl, x, yy); yy += tl.length * 4; });
      return yy;
    }
    var y1 = box(M, 85, 'Supplier', [sp.name || '', sp.email || '']);
    var info = [['Vessel', 'M/V ' + sh.name], ['Requisition', rq ? rq.num : '-'], ['Department', d.dept && L[d.dept] ? L[d.dept][1] : (d.dept || '-')], ['Currency', d.cur || '-']];
    if (d.type === 'RFQ') info.push(['Quotation limit', pdfDate(d.limit)], ['Required on board', pdfDate(d.due || (rq && rq.due))]);
    else info.push(['Delivery', pdfDate(d.due)], ['Terms', d.terms || '-'], ['Your quotation', d.offerRef || '-']);
    doc.setFontSize(8.5); var yi = y;
    info.forEach(function (r) { doc.setTextColor(110, 110, 110); doc.text(pdfTxt(r[0]), 112, yi); doc.setTextColor(30, 30, 30); var tl = doc.splitTextToSize(pdfTxt(r[1]), 52); doc.text(tl, 144, yi); yi += Math.max(1, tl.length) * 4; });
    y = Math.max(y1, yi) + 2;
    if (d.type === 'PO' && (T.invoiceTo.name || T.invoiceTo.address)) { y = box(M, 85, 'Invoice to', [T.invoiceTo.name, T.invoiceTo.address, T.invoiceTo.email].filter(Boolean)) + 2; }
    y += 2;
    doc.setFontSize(9); doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal');
    var it = doc.splitTextToSize(pdfTxt(K.intro || ''), W - 2 * M); doc.text(it, M, y); y += it.length * 4 + 3;
    // table
    var C = K.cols || {}, head = ['Row'], body = [];
    if (C.impa) head.push('IMPA / Code');
    head.push('Description');
    if (C.asset) head.push('Asset');
    head.push('Qty', 'UOM');
    if (d.type === 'PO') { head.push('Unit price', 'Disc.', 'Amount'); if (C.cond) head.push('Cond.'); if (C.due) head.push('Delivery'); }
    else if (C.fill) head.push('Unit price', 'Disc.', 'LT days', 'Cond.');
    d.lines.forEach(function (l) {
      var r = [String(l.row)];
      if (C.impa) r.push(l.impa || (l.code && l.code !== 'GI0001' ? l.code : ''));
      r.push(pdfTxt(l.desc + (C.note && l.note ? '\n' + l.note : '')));
      if (C.asset) r.push(pdfTxt(l.asset || ''));
      r.push((l.qty || 0).toLocaleString('en-GB', { maximumFractionDigits: 2 }), l.uom || '');
      if (d.type === 'PO') { r.push((l.price || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 4 }), l.d1 ? l.d1 + '%' : '', (l.net || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })); if (C.cond) r.push(l.cond || ''); if (C.due) r.push(pdfDate(l.due)); }
      else if (C.fill) r.push('', '', '', '');
      body.push(r);
    });
    doc.autoTable({ startY: y, head: [head], body: body, margin: { left: M, right: M }, theme: 'grid',
      styles: { font: 'helvetica', fontSize: 8, cellPadding: 1.6, lineColor: [210, 210, 210], lineWidth: 0.2, textColor: [30, 30, 30], valign: 'top' },
      headStyles: { fillColor: col, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: (function () { var o = {}, di = head.indexOf('Description'); o[di] = { cellWidth: 'auto' }; head.forEach(function (h, i) { if (/Qty|Unit price|Disc\.|Amount|LT days/.test(h)) o[i] = { halign: 'right' }; if (h === 'Description') o[i] = { cellWidth: d.type === 'PO' ? 56 : 66 }; if (h === 'IMPA / Code') o[i] = { cellWidth: 19 }; if (h === 'Asset') o[i] = { cellWidth: 26 }; if (h === 'Cond.') o[i] = { cellWidth: 19 }; if (h === 'Delivery') o[i] = { cellWidth: 19 }; }); return o; })() });
    y = doc.lastAutoTable.finalY + 4;
    if (d.type === 'PO') {
      var goods = d.lines.reduce(function (a, l) { return a + (l.net || 0); }, 0), rows = [['Goods', pdfMoney(goods, d.cur)]];
      (d.charges || []).filter(function (c) { return c.amount; }).forEach(function (c) { rows.push([pdfTxt(L2(['', ''])) + ({ transport: 'Transport', packing: 'Packing', other: 'Other charges' }[c.kind] || c.kind), pdfMoney(c.amount, d.cur)]); });
      rows.push(['TOTAL', pdfMoney(d.total, d.cur)]);
      doc.autoTable({ startY: y, body: rows, margin: { left: W - M - 80, right: M }, theme: 'plain', styles: { fontSize: 9, cellPadding: 1.2 }, columnStyles: { 1: { halign: 'right' } },
        didParseCell: function (h) { if (h.row.index === rows.length - 1) { h.cell.styles.fontStyle = 'bold'; h.cell.styles.textColor = col; } } });
      y = doc.lastAutoTable.finalY + 4;
    }
    function para(txt, size, bold) { if (!txt) return; doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal'); var tl = doc.splitTextToSize(pdfTxt(txt), W - 2 * M); if (y + tl.length * 4 > 280) { doc.addPage(); y = 18; } doc.text(tl, M, y); y += tl.length * (size / 2.4) + 3; }
    para(K.closing, 9, true);
    para(K.clauses, 8, false);
    var n = doc.getNumberOfPages();
    for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(7); doc.setTextColor(120, 120, 120); doc.text(pdfTxt((T.footer ? T.footer + '  ·  ' : '') + d.num + '  ·  Page ' + i + '/' + n), W / 2, 290, { align: 'center' }); }
    return doc;
  }
  function pdfName(d) { return (d.type === 'RFQ' ? 'RFQ_' : 'PO_') + d.num.replace(/\//g, '-') + (d.rev ? '_REV' + d.rev : '') + '.pdf'; }
  function saveBlob(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }
  function pdfPreview(d) {
    loadPdfLib().then(function () {
      var doc = buildPdf(d), blob = doc.output('blob'), u = URL.createObjectURL(blob);
      var bg = document.createElement('div'); bg.className = 'modal-bg';
      bg.innerHTML = '<div class="modal" style="width:min(1000px,100%);height:92vh" role="dialog" aria-modal="true" aria-label="PDF"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3>' + esc(pdfName(d)) + '</h3><span style="display:flex;gap:8px"><button class="btn" data-dl="1">' + esc(L2(['Scarica PDF', 'Download PDF'])) + '</button><a class="btn" href="#/impostazioni">' + esc(L2(['Modifica modello', 'Edit template'])) + '</a><button class="btn" data-x="1">' + esc(t('close')) + '</button></span></div><iframe title="PDF" src="' + u + '" style="flex:1;width:100%;border:1px solid var(--line);border-radius:8px;background:#fff"></iframe></div>';
      document.body.appendChild(bg);
      bg.addEventListener('click', function (e) { if (e.target === bg || e.target.getAttribute('data-x') || e.target.closest('a')) { bg.remove(); URL.revokeObjectURL(u); } if (e.target.getAttribute('data-dl')) saveBlob(blob, pdfName(d)); });
    }).catch(function () { toast(L2(['Libreria PDF non disponibile', 'PDF library not available'])); });
  }
  function b64utf8(s) { return btoa(unescape(encodeURIComponent(s))).replace(/.{76}/g, '$&\r\n'); }
  function encHeader(s) { return /[^\x20-\x7E]/.test(s) ? '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(s))) + '?=' : s; }
  function buildEml(to, subj, body, pdfB64, name) {
    var bd = '----=_FleetAsset_' + Date.now();
    return ['X-Unsent: 1', 'To: ' + to, 'Subject: ' + encHeader(subj), 'MIME-Version: 1.0', 'Content-Type: multipart/mixed; boundary="' + bd + '"', '',
      '--' + bd, 'Content-Type: text/plain; charset="utf-8"', 'Content-Transfer-Encoding: base64', '', b64utf8(body), '',
      '--' + bd, 'Content-Type: application/pdf; name="' + name + '"', 'Content-Transfer-Encoding: base64', 'Content-Disposition: attachment; filename="' + name + '"', '', pdfB64.replace(/.{76}/g, '$&\r\n'), '',
      '--' + bd + '--', ''].join('\r\n');
  }
  FORMS.mail = function (d, to) {
    var sh = shipBy(d.ship), rq = d.from && byId(d.from[0]), sp = supById(d.sup) || {};
    var subj = 'M/V ' + sh.name + ' · ' + (d.type === 'RFQ' ? 'RFQ ' : 'PURCHASE ORDER ') + d.num + (d.rev ? ' REV. ' + d.rev : '') + (rq && d.type === 'RFQ' ? ' · ' + rq.num : '') + ' · ' + (sp.name || '');
    var body = d.type === 'RFQ'
      ? 'Dear Sirs,\n\nPlease find attached our Request for Quotation ' + d.num + ' for M/V ' + sh.name + '.\nKindly revert by ' + fd(d.limit) + ' with your best offer, stating price, availability, delivery time, place of origin / stock and condition (Genuine, Non genuine or Reconditioned) for each item.\n\nThis inquiry is a request for quotation only and is NOT a purchase order. Kindly quote our RFQ number in all correspondence.\n\nBest regards'
      : 'Dear Sirs,\n\nPlease find attached our Purchase Order ' + d.num + (d.rev ? ' Rev. ' + d.rev + ', which supersedes the previous version' : '') + ' for M/V ' + sh.name + (d.offerRef ? ', as per your quotation ' + d.offerRef : '') + '.\nKindly confirm acceptance, delivery date and dispatch details by return.\n\nBest regards';
    var name = pdfName(d);
    formModal(L2(['Email al fornitore', 'Email to supplier']) + ' · ' + d.num,
      '<label>' + esc(L2(['A', 'To'])) + '<input name="to" type="email" value="' + esc(sp.email || '') + '" placeholder="email@fornitore"></label>' +
      '<label>' + esc(L2(['Oggetto', 'Subject'])) + '<input name="subj" value="' + esc(subj) + '"></label>' +
      '<label>' + esc(L2(['Testo', 'Body'])) + '<textarea name="body" rows="9" class="j" style="font-size:12px">' + esc(body) + '</textarea></label>' +
      '<div class="note" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:var(--ink)"><span>' + esc(L2(['Allegato', 'Attachment'])) + ': <b class="j">' + esc(name) + '</b></span><button type="button" class="btn sm" data-pv="1">' + esc(L2(['Anteprima PDF', 'Preview PDF'])) + '</button></div>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['"Bozza Outlook" scarica un file .eml: aprilo e Outlook mostra il messaggio pronto con il PDF allegato, da controllare e inviare. Poi torna qui e segna come inviato.', '"Outlook draft" downloads an .eml file: open it and Outlook shows the message ready with the PDF attached. Then mark as sent here.'])) + '</div>',
      function (f) {
        if (f.elements.to.value) sp.email = f.elements.to.value.trim();
        if (d.needResend && d.status === to) { d.needResend = false; d.log.push({ at: TODAY, to: to, txt: 'Rev. ' + d.rev + ' ' + L2(['rinviata', 'resent']) + (f.elements.to.value ? ' · ' + f.elements.to.value : '') }); }
        else setStatus(d, to, (f.elements.to.value ? 'email ' + f.elements.to.value : 'email') + ' · ' + name);
        if (d.type === 'RFQ') d.sentAt = TODAY;
        save(); render(); toast(L2(['Segnato come inviato', 'Marked as sent']));
      }, { w: 760, ok: L2(['Segna come inviato', 'Mark as sent']),
        extra: '<button type="button" class="btn pri" data-eml="1">' + esc(L2(['Bozza Outlook (.eml)', 'Outlook draft (.eml)'])) + '</button><button type="button" class="btn" data-copy="1">' + esc(L2(['Copia testo', 'Copy text'])) + '</button>',
        onClick: function (e, f) {
          if (e.target.getAttribute('data-pv')) pdfPreview(d);
          if (e.target.getAttribute('data-copy')) { var txt = f.elements.subj.value + '\n\n' + f.elements.body.value; try { navigator.clipboard.writeText(txt).then(function () { toast(L2(['Testo copiato', 'Text copied'])); }, function () { f.elements.body.select(); }); } catch (x) { f.elements.body.select(); } }
          if (e.target.getAttribute('data-eml')) {
            loadPdfLib().then(function () {
              var pdf = buildPdf(d).output('datauristring').split(',')[1];
              var eml = buildEml(f.elements.to.value.trim(), f.elements.subj.value, f.elements.body.value.replace(/\n/g, '\r\n'), pdf, name);
              saveBlob(new Blob([eml], { type: 'message/rfc822' }), name.replace(/\.pdf$/, '.eml'));
              d.log = d.log || []; d.log.push({ at: TODAY, to: d.status, txt: L2(['Bozza Outlook creata', 'Outlook draft created']) + ' · ' + name }); save();
              toast(L2(['Bozza scaricata: aprila con Outlook', 'Draft downloaded: open it with Outlook']));
            }).catch(function () { toast(L2(['Libreria PDF non disponibile', 'PDF library not available'])); });
          }
        } });
  };
  CLICK.pdf = function () { var d = curDoc(); if (d) pdfPreview(d); };

  function pageSettings() {
    var T = tpl();
    function inp(path, v, ph, wide) { return '<input data-set="' + path + '" value="' + esc(v || '') + '" placeholder="' + esc(ph || '') + '" style="' + (wide ? 'flex:1;min-width:260px' : '') + '">'; }
    function area(path, v, rows) { return '<textarea data-set="' + path + '" rows="' + (rows || 3) + '" style="width:100%;background:var(--bg);border:1px solid var(--line2);border-radius:8px;padding:8px 10px;color:var(--ink);font:inherit">' + esc(v || '') + '</textarea>'; }
    function lab(l, html) { return '<label class="stack" style="gap:4px;font-size:13px;color:var(--mute);flex:1 1 220px">' + esc(l) + html + '</label>'; }
    function colBox(type, k, l) { return '<label class="tog"><input type="checkbox" data-setcol="' + type + '|' + k + '"' + (T[type].cols[k] ? ' checked' : '') + '> ' + esc(l) + '</label>'; }
    var sample = function (type) { return docs(function (x) { return x.type === type && x.lines && x.lines.length; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0]; };
    var sec = function (type, label, cols) {
      var s = sample(type);
      return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><h2>' + esc(label) + '</h2>' + (s ? '<button class="btn sm" data-act="pdfsample" data-id="' + s.id + '">' + esc(L2(['Anteprima su ', 'Preview on '])) + esc(s.num) + '</button>' : '') + '</div>' +
        '<div class="filters">' + lab(L2(['Titolo del documento', 'Document title']), inp(type + '.title', T[type].title)) + '</div>' +
        lab(L2(['Testo di apertura', 'Opening text']), area(type + '.intro', T[type].intro, 3)) +
        lab(L2(['Testo di chiusura', 'Closing text']), area(type + '.closing', T[type].closing, 2)) +
        lab(L2(['Clausole fisse (una per riga)', 'Fixed clauses (one per line)']), area(type + '.clauses', T[type].clauses, 3)) +
        '<div class="filters"><span class="mute" style="font-size:13px">' + esc(L2(['Colonne', 'Columns'])) + '</span>' + cols + '</div></section>';
    };
    var body = '<section class="card stack"><h2>' + esc(L2(['Intestazione', 'Letterhead'])) + '</h2>' +
      '<div class="filters">' + lab(L2(['Società', 'Company']), inp('company.name', T.company.name, 'Ragione sociale')) + lab(L2(['Indirizzo', 'Address']), inp('company.address', T.company.address)) + '</div>' +
      '<div class="filters">' + lab(L2(['Telefono', 'Phone']), inp('company.phone', T.company.phone)) + lab('Email', inp('company.email', T.company.email)) + lab('Web', inp('company.web', T.company.web)) + '</div>' +
      '<div class="filters">' + lab(L2(['Logo (PNG o JPG, max 300 KB)', 'Logo (PNG or JPG, max 300 KB)']), '<input type="file" accept="image/png,image/jpeg" data-act="logo">') +
      (T.logo ? '<img src="' + T.logo + '" alt="Logo" style="max-height:48px;max-width:160px;background:#fff;padding:4px;border-radius:6px">' + '<button class="btn sm ghost" data-act="logodel">' + esc(L2(['Rimuovi logo', 'Remove logo'])) + '</button>' : '') +
      lab(L2(['Colore', 'Colour']), '<input type="color" data-set="color" value="' + esc(T.color) + '" style="width:60px;height:36px;padding:2px">') + '</div>' +
      '<div class="filters">' + lab(L2(['Fatturare a (solo ordini)', 'Invoice to (orders only)']), inp('invoiceTo.name', T.invoiceTo.name)) + lab(L2(['Indirizzo fatturazione', 'Invoice address']), inp('invoiceTo.address', T.invoiceTo.address)) + lab(L2(['Email fatture', 'Invoice email']), inp('invoiceTo.email', T.invoiceTo.email)) + '</div>' +
      lab(L2(['Piè di pagina', 'Footer']), inp('footer', T.footer, '', true)) + '</section>' +
      sec('RFQ', L2(['Richiesta di offerta (RFQ)', 'Request for quotation (RFQ)']), colBox('RFQ', 'impa', 'IMPA / Code') + colBox('RFQ', 'note', L2(['Nota / P/N', 'Note / P/N'])) + colBox('RFQ', 'asset', 'Asset') + colBox('RFQ', 'fill', L2(['Colonne vuote per il fornitore', 'Blank columns for the supplier']))) +
      sec('PO', L2(['Ordine (PO)', 'Purchase order (PO)']), colBox('PO', 'impa', 'IMPA / Code') + colBox('PO', 'note', L2(['Nota / P/N', 'Note / P/N'])) + colBox('PO', 'asset', 'Asset') + colBox('PO', 'cond', L2(['Condizione', 'Condition'])) + colBox('PO', 'due', L2(['Consegna', 'Delivery']))) +
      '<div class="note">' + esc(L2(['Le modifiche si salvano subito e valgono per tutti i PDF e le bozze Outlook generate da qui in avanti.', 'Changes are saved immediately and apply to all PDFs and Outlook drafts generated from now on.'])) + '</div>' +
      '<div><button class="btn link" data-act="tplreset">' + esc(L2(['Ripristina modello predefinito', 'Reset to default template'])) + '</button></div>';
    return shell('impostazioni', crumb([[t('fleet'), '#/']]), L2(['Modelli documenti', 'Document templates']), body);
  }
  function setPath(path, val) {
    DB.settings = DB.settings || {};
    var p = path.split('.'), o = DB.settings;
    if (p.length === 1) o[p[0]] = val; else { o[p[0]] = o[p[0]] || {}; o[p[0]][p[1]] = val; }
    save();
  }
  CLICK.pdfsample = function (a) { var d = byId(a.getAttribute('data-id')); if (d) pdfPreview(d); };
  CLICK.logodel = function () { setPath('logo', ''); render(); };
  CLICK.tplreset = function () { var keep = DB.settings || {}; DB.settings = { company: keep.company, invoiceTo: keep.invoiceTo, logo: keep.logo }; save(); render(); toast(L2(['Testi e colonne ripristinati', 'Texts and columns reset'])); };

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
    else if (s[0] === 'contabilita') html = pageAcc(r.q);
    else if (s[0] === 'impostazioni') html = pageSettings();
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
  window.addEventListener('hashchange', function () { UI.colOpen = false; render(); window.scrollTo(0, 0); if (UI.edit && route().seg[1] !== UI.edit.id) toast(L2(['Hai una modifica non salvata: torna al documento per salvarla o annullarla.', 'You have an unsaved edit: go back to the document to save or cancel it.'])); });
  window.addEventListener('beforeunload', function (e) { if (UI.edit && UI.edit.dirty) { e.preventDefault(); e.returnValue = ''; } });

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
    else if (act === 'seat') { P.seat = a.getAttribute('data-to') || 'ship'; savePrefs(); render(); toast(L2(['Postazione: ', 'Station: ']) + seatName()); }
    else if (act === 'consume' || act === 'count') { stockModal(act, a.getAttribute('data-item'), a.getAttribute('data-ship')); }
    else if (act === 'reorder') { reorder(a.getAttribute('data-ship')); }
    else if (CLICK[act]) { CLICK[act](a, r); }
    else if (act === 'colmenu') { UI.colOpen = !UI.colOpen; render(); }
    else if (act === 'bexp') { UI.expanded[a.getAttribute('data-k')] = a.getAttribute('data-o') !== '1'; render(); }
    else if (act === 'adv') {
      var d = byId(r.seg[1]), to = a.getAttribute('data-to'), form = a.getAttribute('data-form');
      if (form === 'offer' && !(d.lines && d.lines.length)) {
        var sp = supById(d.sup);
        modal(ST.RFQ.quotata[P.lang === 'en' ? 1 : 0], [
          { n: 'tot', l: t('offerTotal'), v: d.total ? nf(d.total) : '', req: 1, num: 1 },
          { n: 'cur', l: t('currency'), type: 'select', opts: ['EUR', 'USD'], v: d.cur || (sp && sp.cur) || 'EUR' },
          { n: 'ref', l: t('extRef'), v: '' },
          { n: 'days', l: t('validDays'), v: '30', num: 1 }], function (v) {
          d.total = parseNum(v.tot); d.cur = v.cur; d.offer = { ref: v.ref, days: parseInt(v.days, 10) || 30, at: TODAY };
          advance(d, to, money(d.total, d.cur));
        });
      } else if (form === 'approve' && !(d.lines && d.lines.length)) {
        modal(t('appr'), [{ n: 'note', l: t('note'), type: 'area' }], function (v) { advance(d, to, v.note); });
      } else if (form === 'receive') { receiveModal(d);
      } else if (FORMS[form]) { FORMS[form](d, to);
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
    if (el.getAttribute('data-edit')) { editLine(el); return; }
    if (el.getAttribute('data-set')) { setPath(el.getAttribute('data-set'), el.value); toast(L2(['Modello salvato', 'Template saved'])); return; }
    if (el.getAttribute('data-setcol')) { var pc = el.getAttribute('data-setcol').split('|'), cc = JSON.parse(JSON.stringify(tpl()[pc[0]].cols)); if (el.checked) cc[pc[1]] = 1; else delete cc[pc[1]]; DB.settings = DB.settings || {}; DB.settings[pc[0]] = DB.settings[pc[0]] || {}; DB.settings[pc[0]].cols = cc; save(); return; }
    if (el.getAttribute('data-act') === 'logo') { var lf = el.files && el.files[0]; if (!lf) return; if (lf.size > 300 * 1024) { toast(L2(['Logo troppo grande (max 300 KB)', 'Logo too large (max 300 KB)'])); return; } var lr = new FileReader(); lr.onload = function () { setPath('logo', lr.result); render(); }; lr.readAsDataURL(lf); return; }
    if (el.getAttribute('data-hedit')) { var dh = curDoc(); if (dh && UI.edit && UI.edit.id === dh.id) { var hf = el.getAttribute('data-hedit'); dh[hf] = el.value; UI.edit.dirty = true; } return; }
    if (el.id === 'seatsel') { P.seat = el.value; savePrefs(); render(); toast(L2(['Postazione: ', 'Station: ']) + seatName()); return; }
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

  ensureDemo();
  if (!DB.settings && window.SEED.settings) { DB.settings = clone(window.SEED.settings); save(); }
  render();
})();
