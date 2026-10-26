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
    if (DB.shipments) shipmentBudget(ship, add);
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
      railHtml(active, ship) +
      '<div class="main"><header class="top">' +
      '<div class="crumbs"><small>' + crumbs + '</small><b>' + esc(title) + '</b></div>' +
      '<div class="search"><label>' + ico('search') + '<input id="gsearch" type="search" autocomplete="off" aria-label="' + esc(t('search')) + '" placeholder="' + esc(t('search')) + '"><span class="kbd j">Ctrl K</span></label><div id="gres"></div></div>' +
      '<div class="tools">' + (DB.meta.demo ? '<a class="chip c-warn" href="#/dati" style="text-decoration:none">' + esc(P.lang === 'en' ? 'Sample data' : 'Dati di esempio') + '</a>' : '') + 
      (UI.edit && UI.edit.id !== (route().seg[1] || '') ? '<a class="chip c-bad" style="text-decoration:none" href="#/doc/' + UI.edit.id + '">' + esc(L2(['Modifica non salvata', 'Unsaved edit'])) + '</a>' : '') +
      '<label class="fx" title="' + esc(L2(['Postazione', 'Station'])) + '"><select id="seatsel" aria-label="' + esc(L2(['Postazione', 'Station'])) + '" style="border:0;background:transparent;font-weight:700">' +
      [['office', ['Ufficio acquisti', 'Purchasing office']], ['ship', ['Bordo', 'Vessel']], ['acc', ['Contabilità', 'Accounting']]].map(function (o) { return '<option value="' + o[0] + '"' + (P.seat === o[0] ? ' selected' : '') + '>' + esc(L2(o[1])) + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      '</header><div class="page">' + secTabs(active) + body + '</div></div></div>';
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
    var dnBy = DB.ships.map(function (s) { var n = docs(function (d) { return d.ship === s.code && d.type === 'DN' && isOpen(d); }).length; return n ? s.code + ' ' + n : null; }).filter(Boolean).join(' · ');
    var dnTot = docs(function (d) { return d.type === 'DN' && isOpen(d); }).length;
    var demo = byId('DEMO-RQ'), demoChain = docs(function (d) { return d.demo; });
    var demoLast = demoChain.slice().sort(function (a, b) { return FLOWORDER[b.type] - FLOWORDER[a.type]; })[0];
    var side = '<aside class="side">' +
      '<section class="card stack" style="border-color:var(--accLine)"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2>' + esc(L2(['Pratica demo', 'Demo case'])) + '</h2><span class="chip c-acc">DEMO</span></div>' +
      '<div style="font-size:13px">' + esc(demo ? demo.num + ' · ' + demo.desc : '—') + '</div>' +
      (demoLast ? '<div class="mute" style="font-size:12px">' + esc(L2(['A che punto è: ', 'Current step: '])) + esc(t(demoLast.type + '1')) + ' ' + esc(demoLast.num) + ' · ' + esc(stLabel(demoLast)) + '</div>' : '') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn pri" href="#/doc/' + (demoLast ? demoLast.id : 'DEMO-RQ') + '">' + esc(L2(['Riprendi', 'Resume'])) + '</a><button class="btn" data-act="demoreset">' + esc(L2(['Ricomincia da capo', 'Start over'])) + '</button></div></section>' +
      (function () { var it = todayItems(''); return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:baseline"><h2>' + esc(L2(['Da fare', 'To do'])) + '</h2><a href="#/docs?tipo=todo" style="font-size:12px">' + esc(t('all')) + ' (' + it.length + ')</a></div>' +
        TODO.map(function (g) { var n = it.filter(function (x) { return g[2].indexOf(x.g) >= 0; }).length; return '<a href="#/docs?tipo=todo" style="display:flex;justify-content:space-between;text-decoration:none;color:var(--ink);border-top:1px solid var(--line);padding-top:9px"><span>' + esc(L2(g[1])) + '</span><b class="j ' + (n ? 't-warn' : 'mute') + '">' + n + '</b></a>'; }).join('') + '</section>'; })() +
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
    return '<div class="stack" style="gap:6px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:12px"><span class="mute">' + esc(t('rm')) + ' 2026</span><span class="j" style="font-weight:600;white-space:nowrap">' + nf(rm.o + rm.d, 0) + ' / ' + nf(rm.b, 0) + ' €</span></div>' +
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
        '<div class="row"><div class="grow stack">' + (DB.budgets[code] ? '<a class="card stack" href="#/budget?nave=' + code + '" style="text-decoration:none;color:var(--ink);max-width:560px"><h2 style="margin:0">' + esc(t('budget')) + ' 2026</h2>' + shipBudgetBlock(code) + '</a>' : '') +
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
    if (!q) return true; q = q.toUpperCase().replace(/\//g, '-');
    return (d.num + ' ' + (d.orig || '') + ' ' + d.desc + ' ' + supName(d.sup)).toUpperCase().indexOf(q) >= 0;
  }
  function pageDocs(q) {
    if (q.tipo === 'todo') return shell('docs', crumb([[t('fleet'), '#/'], [t('purchasing')]]), L2(['Da fare', 'To do']) + (q.nave ? ' · ' + q.nave : ''), todoBody(q));
    var tipo = q.tipo || 'RQ', nave = q.nave || '';
    var base = docs(function (d) { return !nave || d.ship === nave; });
    var tabs = ['RQ', 'RFQ', 'PO', 'DN', 'FT'].map(function (ty) {
      var n = base.filter(function (d) { return d.type === ty; }).length;
      return '<a class="' + (ty === tipo ? 'on' : '') + '" href="#/docs' + qs({ tipo: ty, nave: nave }) + '">' + esc(t(ty)) + '<span class="j">' + n + '</span></a>';
    }).join('');
    var rows = base.filter(function (d) {
      return d.type === tipo && (!q.stato || d.status === q.stato) && (q.chiusi || isOpen(d)) && (!q.late || isLate(d)) && matchQ(d, q.q);
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
      '<label class="tog"><input type="checkbox" data-filter="chiusi"' + (q.chiusi ? ' checked' : '') + '> ' + esc(P.lang === 'en' ? 'Show closed' : 'Mostra chiusi') + '</label>' +
      '<label class="tog"><input type="checkbox" data-filter="late"' + (q.late ? ' checked' : '') + '> ' + esc(t('onlyLate')) + '</label>' +
      '<span style="flex:1"></span><span class="mute j" style="font-size:12px">' + rows.length + ' ' + esc(t('rows')) + '</span>' +
      (tipo === 'RQ' ? '<button class="btn pri sm" data-act="newrq" data-ship="' + nave + '">' + esc(L2(['Nuova richiesta', 'New requisition'])) + '</button>' : '') +
      '<div class="colmenu"><button class="btn sm" data-act="colmenu" aria-expanded="' + UI.colOpen + '">' + esc(t('columns')) + '</button>' + menu + '</div></div>';
    var title = t(tipo) + (nave ? ' · ' + nave : '');
    return shell('docs', crumb([[t('fleet'), '#/'], nave ? [shipBy(nave).name, '#/nave/' + nave] : [t('allShips')], [t('purchasing')]]), title,
      filt + gridTable(rows, cols, srt.k, srt.d));
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
    var lines = (linesOpen(d) && !(UI.edit && UI.edit.id === d.id) && !d.lines.length) ? '<section class="card stack"><h2>' + esc(t('lines')) + '</h2><div class="note">' + esc(L2(['Nessuna riga. Premi Modifica per aggiungere gli articoli.', 'No rows. Press Edit to add items.'])) + '</div></section>' : editable(d) ? rqEditor(d) + comparison(d) : (UI.edit && UI.edit.id === d.id && d.type === 'PO' && d.lines) ? poEditor(d) : (UI.edit && UI.edit.id === d.id && d.type === 'RFQ' && d.status === 'quotata' && d.lines && d.lines.length) ? rfqEditor(d) : d.lines ? linesTable(d) + (d.type === 'RQ' ? comparison(d) : '') : '<section class="card stack"><h2>' + esc(t('lines')) + '</h2><div class="note">' + esc(t('noLines')) + '</div></section>';

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
        '</section>';
    }
    var log = (d.log || []).slice().reverse().map(function (e) { return '<div><span class="j">' + fd(e.at) + '</span><span>' + esc(e.txt) + '</span></div>'; }).join('') ||
      '<div><span class="j">' + fd(d.date) + '</span><span>' + esc(P.lang === 'en' ? 'Imported from InfoSHIP' : 'Importato da InfoSHIP') + ' · ' + esc(stLabel(d)) + '</span></div>';

    var head = '<div class="stack" style="gap:8px"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="j mute">' + esc(d.num) + '</span>' + chip(d) +
      (isLate(d) ? '<span class="chip c-bad">' + esc(t('late')) + '</span>' : '') +
      (d.prio && d.prio !== 'normale' ? '<span class="chip c-bad">' + esc(L2(PRIO[d.prio])) + '</span>' : '') + (d.demo ? '<span class="chip c-acc">DEMO</span>' : '') +
      (d.rev ? '<span class="chip c-warn">Rev. ' + d.rev + '</span>' : '') +
      '<span style="flex:1"></span>' + moreMenu(d) + '</div>' +
      (UI.edit && UI.edit.id === d.id ? editHeader(d) : '<h1 class="h1">' + esc(d.desc || '—') + '</h1>' + (d.note ? '<div class="note">' + esc(d.note) + '</div>' : '')) + '</div>';
    var body = '<div class="row">' + pathHtml + '<div class="grow stack" style="gap:14px">' + head + info +
      docTabs(d, { righe: lines, all: { RQ: 1, RFQ: 1, PO: 1, DN: 1, FT: 1 }[d.type] ? attSection(d) : null, sped: d.type === 'DN' ? (feat('qr') ? qrCard(d) : '') + logisticsCard(d) : null,
        cron: '<section class="card stack"><h2>' + esc(t('chain')) + '</h2><div class="chain">' + chainHtml + '</div></section><section class="card stack"><h2>' + esc(t('history')) + '</h2><div class="log">' + log + '</div></section>' }) +
      '</div><aside class="side">' + nextHtml + '</aside></div>';
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
    var ship = q.nave && DB.budgets[q.nave] ? q.nave : 'PEP', noBud = q.nave && !DB.budgets[q.nave];
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
    var body = '<div class="shippick">' + tabs + '</div>' + head +
      '<div class="filters"><span class="legend"><span><i style="background:var(--bar2)"></i>' + esc(P.lang === 'en' ? 'within pro rata' : 'entro il pro rata') + '</span><span><i style="background:var(--red)"></i>' + esc(P.lang === 'en' ? 'over pro rata or no budget' : 'oltre il pro rata o senza budget') + '</span></span><span style="flex:1"></span>' +
      '<label class="tog"><input type="checkbox" data-act="zero"' + (UI.showZero ? ' checked' : '') + '> ' + esc(t('showZero')) + '</label></div>' +
      '<div class="tablebox btree"><table class="grid"><thead><tr><th>' + esc(t('acct')) + '</th><th class="num">' + esc(t('b_budget')) + '</th><th class="num">' + esc(t('b_ord')) + '</th><th class="num">' + esc(t('b_del')) + '</th><th class="num">' + esc(t('b_rem')) + '</th><th>' + esc(t('b_use')) + '</th><th class="num">' + esc(t('b_pr')) + '</th></tr></thead><tbody>' + tr + '</tbody></table></div>' +
      '<div class="note">' + esc(t('b_note')) + '</div>';
    if (noBud) body = '<div class="note">' + esc(shipBy(q.nave).name + L2([': nessun budget in InfoSHIP. Qui sotto il budget di ', ': no budget in InfoSHIP. Below the budget of '])) + shipBy(ship).name + '.</div>' + body;
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
      (feat('score') ? scoreCard(id) : '') + '<h2 style="margin:0;font-size:15px">' + esc(t('s_hist')) + '</h2>' + gridTable(rows, ['num', 'type', 'ship', 'desc', 'status', 'total', 'date'], null, null);
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
      var priced = d.type !== 'RQ' && !(d.type === 'RFQ' && d.status !== 'quotata');
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
      return '<tr><td class="j">' + l.row + '</td><td>' + esc(l.desc) + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') + '</td><td class="num j">' + nf(l.qty) + ' ' + esc(l.uom) + '</td><td><input name="q' + i + '" value="' + nf(l.qty) + '" inputmode="decimal" style="width:90px;text-align:right" aria-label="' + esc(t('l_recv')) + ' ' + l.row + '"></td><td>' + locSelect(dn.ship, i, locOf(dn.ship, l.item)) + '</td></tr>';
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
          var loc = locRead(form, i); if (loc) { DB.loc = DB.loc || {}; DB.loc[dn.ship + '|' + l.item] = loc; }
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
    var tabs = '<nav class="tabs">' + [['art', 'st_items'], ['mov', 'st_moves']].map(function (x) { var n = x[0] === 'arr' ? arrivals(ship).length : 0; return '<a class="' + (tab === x[0] ? 'on' : '') + '" href="#/magazzino' + qs({ nave: ship, tab: x[0] }) + '">' + esc(typeof x[1] === 'string' ? t(x[1]) : L2(x[1])) + (n ? '<span class="j">' + n + '</span>' : '') + '</a>'; }).join('') + '</nav>';
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
        return (!q.q || ((it.impa || '') + ' ' + it.code + ' ' + it.desc).toUpperCase().indexOf(q.q.toUpperCase()) >= 0) && (!q.under || (mn > 0 && s.qty < mn)) && (!q.stock || s.qty > 0) && (!q.gen || it.generic) && (!q.pl || locParts(locOf(ship, it.id))[0] === q.pl);
      }).sort(function (a, b) { return S[b.id].val - S[a.id].val || (a.desc < b.desc ? -1 : 1); });
      body = '<div class="filters"><input type="search" data-filter="q" value="' + esc(q.q || '') + '" placeholder="' + esc(t('filterTxt')) + '" aria-label="' + esc(t('filterTxt')) + '">' +
        (placementsOf(ship).length ? '<select data-filter="pl" aria-label="' + esc(L2(['Ubicazione', 'Placement'])) + '"><option value="">' + esc(L2(['Tutte le ubicazioni', 'All placements'])) + '</option>' + placementsOf(ship).map(function (p) { return '<option' + (q.pl === p.code ? ' selected' : '') + '>' + esc(p.code) + '</option>'; }).join('') + '</select>' : '') +
        '<label class="tog"><input type="checkbox" data-filter="stock"' + (q.stock ? ' checked' : '') + '> ' + esc(t('st_withStock')) + '</label>' +
        '<label class="tog"><input type="checkbox" data-filter="under"' + (q.under ? ' checked' : '') + '> ' + esc(t('st_under')) + '</label>' +
        '<label class="tog"><input type="checkbox" data-filter="gen"' + (q.gen ? ' checked' : '') + '> ' + esc(t('st_generic')) + '</label>' +
        '<span style="flex:1"></span><span class="mute j" style="font-size:12px">' + rows.length + ' ' + esc(t('rows')) + '</span>' +
        '<button class="btn" data-act="reorder" data-ship="' + ship + '"' + (under ? '' : ' disabled') + '>' + esc(t('st_reorder')) + '</button></div>' +
        '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('l_code')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(L2(['Ubicazione', 'Placement'])) + '</th><th>' + esc(t('l_uom')) + '</th><th class="num">' + esc(t('st_stock')) + '</th><th class="num">' + esc(t('st_incoming')) + '</th><th class="num">' + esc(t('st_min')) + '</th><th class="num">' + esc(t('st_avg')) + '</th><th class="num">' + esc(t('st_val')) + '</th><th>' + esc(t('st_lastSup')) + '</th></tr></thead><tbody>' +
        rows.map(function (it) {
          var s = S[it.id], mn = minOf(ship, it.id), low = mn > 0 && s.qty < mn;
          return '<tr class="r" data-href="#/articolo/' + it.id + '?nave=' + ship + '"><td class="j">' + (it.impa || (!it.generic && it.code) ? esc(it.impa || it.code) : '<span class="chip c-warn">GI0001</span>') + '</td><td>' + esc(it.desc) + '</td><td style="font-size:12px">' + esc(locOf(ship, it.id) || '—') + '</td><td>' + esc(it.uom) + '</td>' +
            '<td class="num j ' + (low ? 't-bad' : '') + '"><b>' + nf(s.qty) + '</b></td><td class="num j">' + (s.inArr ? nf(s.inArr) : '—') + '</td><td class="num j">' + (mn ? nf(mn) : '—') + '</td>' +
            '<td class="num j">' + (s.qty ? nf(s.val / s.qty) : (s.last ? '<span class="mute">' + nf(s.last.price) + '</span>' : '—')) + '</td><td class="num j">' + (s.val ? nf(s.val) : '—') + '</td><td>' + esc(s.last ? supName(s.last.sup) : '—') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    return shell('magazzino', crumb([[t('fleet'), '#/'], [shipBy(ship).name, '#/nave/' + ship]]), t('stores') + ' · ' + ship,
      '<div class="shippick">' + shipTabs + '</div>' + kp + tabs + body + '<div class="note">' + esc(t('st_note')) + '</div>');
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
    var body = '<div class="stack" style="gap:6px"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' + (it.impa ? '<span class="chip c-info j">IMPA ' + esc(it.impa) + '</span>' : (it.generic ? '<span class="chip c-warn">GI0001 · ' + esc(P.lang === 'en' ? 'generic code' : 'codice generico') + '</span>' : '<span class="chip c-info j">P/N ' + esc(it.pn || it.code || '') + '</span>')) + '<span class="chip c-neutral">' + esc(it.uom) + '</span></div><h1 class="h1">' + esc(it.desc) + '</h1></div>' +
      '<div class="kpis">' + kpiBox(t('st_stock'), nf(s.qty), it.uom + (mn && s.qty < mn ? ' · ' + t('st_under') : ''), mn && s.qty < mn ? 'bad' : 'mute', '#/articolo/' + id + '?nave=' + ship) +
      kpiBox(t('st_incoming'), nf(s.inArr), it.uom, 'mute', '#/docs' + qs({ tipo: 'DN', nave: ship, aperti: 1 })) +
      kpiBox(t('st_avg'), s.qty ? nf(s.val / s.qty) : '—', s.last ? t('st_lastPrice') + ' ' + nf(s.last.price) : '', 'mute', '#/articolo/' + id + '?nave=' + ship) +
      kpiBox(t('st_val'), nf(s.val), '€', 'mute', '#/magazzino' + qs({ nave: ship })) + '</div>' +
      '<div class="filters"><label class="tog">' + esc(t('st_min')) + ' <input class="j" data-act="minstock" data-k="' + ship + '|' + id + '" value="' + (mn ? nf(mn) : '') + '" inputmode="decimal" style="width:80px;border:0;background:transparent;text-align:right" aria-label="' + esc(t('st_min')) + '"></label><span style="flex:1"></span>' + acts + '</div>' +
      ((it.maker || it.pn) ? '<div class="note" style="color:var(--ink)">' + esc([it.pn ? 'P/N ' + it.pn : '', it.maker, it.model, it.equipment].filter(Boolean).join(' · ')) + '</div>' : '') +
      (docsForItem(it).length ? '<h2 style="margin:0;font-size:15px">' + esc(L2(['Documentazione tecnica', 'Technical documentation'])) + '</h2><div style="display:flex;gap:8px;flex-wrap:wrap">' + docsForItem(it).map(function (td) { return td.file ? '<button class="btn sm" data-act="opentd" data-id="' + td.id + '">' + esc(td.title) + '</button>' : '<span class="chip c-neutral">' + esc(td.title) + '</span>'; }).join('') + '</div>' : '') +
      '<h2 style="margin:0;font-size:15px">' + esc(t('st_moves')) + '</h2>' + movesTable(s.moves.slice().reverse(), false) +
      '<h2 style="margin:0;font-size:15px">' + esc(t('st_prices')) + '</h2>' +
      (prices.length ? '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(t('c_date')) + '</th><th>' + esc(t('c_num')) + '</th><th>' + esc(t('c_ship')) + '</th><th>' + esc(t('c_sup')) + '</th><th class="num">' + esc(t('l_qty')) + '</th><th class="num">' + esc(t('l_price')) + '</th><th class="num">' + esc(t('l_disc')) + '</th><th class="num">€ / ' + esc(it.uom) + '</th></tr></thead><tbody>' +
        prices.map(function (p) { return '<tr class="r" data-href="#/doc/' + p.po.id + '"><td class="j">' + fd(p.po.date) + '</td><td class="j">' + esc(p.po.num) + '</td><td>' + COLS.ship.v(p.po) + '</td><td>' + esc(supName(p.po.sup)) + '</td><td class="num j">' + nf(p.l.qty) + '</td><td class="num j">' + money(p.l.price, p.po.cur) + '</td><td class="num j">' + (p.l.d1 ? nf(p.l.d1, 1) + '%' : '') + '</td><td class="num j"><b>' + nf(unitEur(p.po, p.l)) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' : '<div class="empty">—</div>');
    return shell('magazzino', crumb([[t('fleet'), '#/'], [shipBy(ship).name, '#/nave/' + ship], [t('stores'), '#/magazzino' + qs({ nave: ship })]]), it.impa || it.pn || 'GI0001', body);
  }
  function nextNum(ship, type) {
    var y = TODAY.slice(0, 4), pre = ship + '-' + y + '-' + type + '-', n = 0;
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
        '<td><input data-edit="' + i + '|desc" value="' + esc(l.desc) + '" style="width:100%" aria-label="' + esc(t('c_desc')) + '"><input data-edit="' + i + '|note" value="' + esc(l.note || '') + '" placeholder="P/N, maker, note" style="width:100%;margin-top:4px;font-size:12px" aria-label="note">' + (feat('catalog') && !l.item && l.desc ? suggHtml(l, i) : '') + '</td>' +
        '<td><input data-edit="' + i + '|asset" value="' + esc(l.asset || '') + '" style="width:150px" aria-label="Asset"></td>' +
        '<td><input class="j" data-edit="' + i + '|qty" value="' + nf(l.qty) + '" inputmode="decimal" style="width:80px;text-align:right" aria-label="' + esc(t('l_qty')) + '"></td>' +
        '<td><input data-edit="' + i + '|uom" value="' + esc(l.uom || 'PCE') + '" style="width:62px" aria-label="' + esc(t('l_uom')) + '"></td>' +
        '<td><button type="button" class="btn sm ghost" data-act="delline" data-i="' + i + '" aria-label="' + esc(L2(['Elimina riga', 'Delete row'])) + ' ' + l.row + '">✕</button></td></tr>';
    }).join('');
    var opts = (DB.items || []).map(function (it) { return '<option value="' + esc((it.impa ? it.impa + ' · ' : '') + it.desc) + '"></option>'; }).join('');
    return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><h2>' + esc(t('lines')) + ' <span class="j mute">' + d.lines.length + '</span></h2><span class="mute" style="font-size:12px">' + esc(L2(['Modificabile fino alla richiesta di quotazione · salvataggio automatico', 'Editable until quotations are requested · saved automatically'])) + '</span></div>' +
      '<div class="tablebox"><table class="grid edit"><thead><tr><th>' + esc(t('l_row')) + '</th><th>IMPA</th><th>' + esc(t('c_desc')) + '</th><th>Asset</th><th class="num">' + esc(t('l_qty')) + '</th><th>' + esc(t('l_uom')) + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="filters"><input id="additem" list="itemlist" placeholder="' + esc(L2(['Aggiungi da anagrafica: IMPA o descrizione', 'Add from catalogue: IMPA or description'])) + '" style="flex:1;min-width:260px" aria-label="' + esc(L2(['Aggiungi articolo', 'Add item'])) + '"><datalist id="itemlist">' + opts + '</datalist>' +
      '<button type="button" class="btn" data-act="addline">' + esc(L2(['Aggiungi riga', 'Add row'])) + '</button><button type="button" class="btn pri" data-act="searchitems">' + esc(L2(['Ricerca avanzata', 'Advanced search'])) + '</button></div></section>';
  }
  function curDoc() { var r = route(); return r.seg[0] === 'doc' ? byId(r.seg[1]) : null; }
  function editLine(el) {
    var d = curDoc(); if (!d || !UI.edit || UI.edit.id !== d.id) return;
    var p = el.getAttribute('data-edit').split('|'), l = d.lines[+p[0]], f = p[1];
    l[f] = el.type === 'checkbox' ? el.checked : f === 'days' ? (el.value.trim() === '' ? null : Math.max(0, parseInt(el.value, 10) || 0)) : /^(qty|price|d1|oqty)$/.test(f) ? Math.max(0, parseNum(el.value)) : el.value.trim();
    if (d.type === 'RFQ') recalcRfq(d);
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
    var minD = {}, minK = {};
    rq.lines.forEach(function (l) { quoted.forEach(function (r) { var x = rfqLine(r, l.row); if (!x || !x.quoted) return; if (x.days != null && (minD[l.row] == null || x.days < minD[l.row])) minD[l.row] = x.days; var k = lineDist(r, x); if (k != null && (minK[l.row] == null || k < minK[l.row])) minK[l.row] = k; }); });
    var bestR = cmpBest(rq, quoted);
    var cols = rfqs.length;
    var head = '<div style="padding:6px 4px;font-size:12px" class="mute">' + esc(t('l_row')) + '</div>' + rfqs.map(function (r) { return cmpHead(r, bestR); }).join('');
    var headOld = rfqs.map(function (r) {
      return '<div style="padding:6px 4px;display:flex;flex-direction:column;gap:4px;align-items:flex-start"><a href="#/doc/' + r.id + '" style="font-weight:700;color:var(--ink);text-decoration:none">' + esc(supName(r.sup)) + '</a>' + '<span class="j mute" style="font-size:11px">' + esc(r.num) + ' · ' + esc(r.cur) + (r.offer && r.offer.incoterm ? ' · ' + esc(r.offer.incoterm + (r.offer.place ? ' ' + r.offer.place : '')) : '') + '</span>' + chip(r) + (feat('score') ? scoreBadge(r.sup) : '') + (r.offer && r.offer.via === 'link' ? '<span class="chip c-info" style="font-size:10px">via link</span>' : '') +
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
            '<span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' + condChip(x.cond) + '<span class="j" style="font-size:11px">' + (x.days != null ? x.days + ' gg' : '') + '</span>' + '</span><span style="display:flex;gap:4px;flex-wrap:wrap">' + (Math.abs(v - best[l.row]) < 0.005 ? '<span class="tag t-price">' + esc(L2(['miglior prezzo', 'best price'])) + '</span>' : '') + (x.days != null && x.days === minD[l.row] && quoted.length > 1 ? '<span class="tag t-fast">' + esc(L2(['più veloce', 'fastest'])) + '</span>' : '') + (lineDist(r, x) != null && lineDist(r, x) === minK[l.row] && quoted.length > 1 ? '<span class="tag t-near">' + esc(L2(['più vicino', 'closest'])) + '</span>' : '') + '</span>' +
            '<span class="mute" style="font-size:12px">' + esc(x.origin || '') + (lineDist(r, x) != null ? ' · ≈ ' + nf(lineDist(r, x), 0) + ' km' : '') + (x.oqty && x.oqty !== l.qty ? ' · ' + esc(L2(['offre', 'offers'])) + ' ' + nf(x.oqty) : '') + '</span>' + '</button>';
        }).join('');
    }).join('');
    var foot = '<div style="border-top:2px solid var(--ink);padding:10px 4px;font-weight:800">' + esc(L2(['Totale offerta', 'Offer total'])) + '</div>' + rfqs.map(function (r) {
      if (r.status !== 'quotata') return '<div style="border-top:2px solid var(--ink)"></div>';
      var lf = feat('landed') ? landedFoot(r) : '';
      var cov = r.lines.filter(function (x) { return x.quoted; }).length;
      return '<div style="border-top:2px solid var(--ink);padding:10px 4px;display:flex;flex-direction:column;gap:2px"><span class="j" style="font-weight:600">' + money(r.total, r.cur) + '</span><span class="j mute" style="font-size:11px">≈ ' + (r.cur === 'USD' ? money(toEur(r.total, 'USD'), 'EUR') : money(toUsd(r.total, 'EUR'), 'USD')) + '</span><span style="font-size:12px">' + esc(L2(['copertura', 'coverage'])) + ' ' + cov + '/' + r.lines.length + ((r.charges || []).some(function (c) { return c.amount; }) ? ' · ' + esc(L2(['spese incluse', 'charges incl.'])) : '') + '</span>' + (r.offer ? '<span class="mute" style="font-size:11px">' + esc(L2(['valida fino al', 'valid until'])) + ' ' + fd(r.offer.validTo) + '</span>' : '') + lf + '</div>';
    }).join('');
    var sum = {}, totE = 0, totL = 0;
    Object.keys(award).forEach(function (row) {
      var r = byId(award[row]); if (!r) return; var x = rfqLine(r, +row); if (!x) return;
      var e = offerEur(r, x); totE += e; if (feat('landed')) totL += e * ((landed(r) || { f: 1 }).f); (sum[r.id] = sum[r.id] || { n: 0, e: 0, r: r }).n++; sum[r.id].e += e;
    });
    var aw = Object.keys(sum).map(function (k) { return '<span>' + esc(supName(sum[k].r.sup)) + ' · ' + sum[k].n + ' ' + esc(L2(['righe', 'rows'])) + ' · <span class="j">' + money(sum[k].e, 'EUR') + '</span></span>'; }).join('');
    return '<section class="card stack" id="cmp"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px"><h2>' + esc(L2(['Comparazione offerte', 'Quotation comparison'])) + ' <span class="j mute">' + quoted.length + '/' + rfqs.length + '</span></h2>' +
      '<div>' + portInput(rq) + '</div></div><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span class="mute" style="font-size:12px">' + esc(L2(['Scegli in automatico:', 'Auto pick:'])) + '</span><button type="button" class="btn sm" data-act="preset" data-k="price">' + esc(L2(['Miglior prezzo', 'Best price'])) + '</button><button type="button" class="btn sm" data-act="preset" data-k="fast">' + esc(L2(['Più veloce', 'Fastest'])) + '</button><button type="button" class="btn sm" data-act="preset" data-k="near">' + esc(L2(['Più vicino alla nave', 'Closest to vessel'])) + '</button>' + (feat('landed') ? '<button type="button" class="btn sm" data-act="preset" data-k="landed">' + esc(L2(['Miglior costo a bordo', 'Best landed cost'])) + '</button>' : '') + '<button type="button" class="btn sm ghost" data-act="preset" data-k="none">' + esc(L2(['Azzera', 'Clear'])) + '</button></div>' +
      '<div style="overflow-x:auto"><div class="cmp" style="min-width:' + (180 + cols * 165) + 'px;grid-template-columns:minmax(170px,1.1fr) repeat(' + cols + ',minmax(170px,1fr))">' + head + body + '</div></div>' +
      (totE ? '<div class="note" style="display:flex;flex-wrap:wrap;gap:6px 22px;color:var(--ink)"><b>' + esc(L2(['Scelta', 'Selection'])) + '</b>' + aw + '<b class="j">' + money(totE, 'EUR') + ' · ' + money(totE * fx(), 'USD') + '</b>' + (totL ? '<span class="j" style="color:var(--accText)">' + esc(L2(['a bordo stimato ', 'landed estimate '])) + money(totL, 'EUR') + '</span>' : '') + '</div>' : '<div class="mute" style="font-size:12px">' + esc(L2(['Clicca un\'offerta per sceglierla riga per riga, oppure usa una proposta automatica.', 'Click an offer to pick it row by row, or use an automatic proposal.'])) + '</div>') + '</section>';
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
        var v = k === 'near' ? (lineDist(r, x) == null ? 1e9 : lineDist(r, x)) * 1e6 + offerEur(r, x) : k === 'fast' ? (x.days == null ? 999 : x.days) * 1e6 + offerEur(r, x) : k === 'landed' ? offerEur(r, x) * ((landed(r) || { f: 1 }).f) : offerEur(r, x);
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
            newDoc('RFQ', rq.ship, { status: 'creata', attachments: JSON.parse(JSON.stringify(rq.attachments || [])), desc: rq.desc, sup: sid, cur: sp.cur || 'EUR', fx: fx(), dept: rq.dept, limit: f.elements.limit.value, due: rq.due, demo: rq.demo, from: [rq.id],
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
            if (feat('approv')) autoApprove(po);
            r.awarded = true;
          });
          setStatus(rq, 'ordinata', made.map(function (p) { return p.num; }).join(', '));
          save(); render(); toast(made.length + ' ' + L2(['ordini in bozza creati', 'draft orders created']));
        }, { ok: L2(['Crea ordini', 'Create orders']) });
    },
    approve: function (po) {
      if (feat('approv')) { var dd = defAccount(po), rr = apprRule(po, dd); if (rr.lvl === 0) { po.account = dd; setStatus(po, 'approvato', L2(['Approvazione automatica · ', 'Automatic approval · ']) + rr.why + ' · ' + dd); save(); render(); toast(L2(['Approvato in automatico', 'Approved automatically'])); return; } }
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
        (feat('approv') ? apprBox(po, def) : '<div class="mute" style="font-size:12px">' + esc(L2(['Approva chiunque: resta traccia di data e nota nella cronologia.', 'Anyone can approve: date and note stay in the history.'])) + '</div>'),
        function (f) { po.account = f.elements.acc.value; setStatus(po, 'approvato', (feat('approv') ? L2(['Approvato da ', 'Approved by ']) + apprRule(po, po.account).who + ' · ' : '') + po.account + (f.elements.note.value ? ' · ' + f.elements.note.value : '')); save(); render(); toast(L2(['Ordine approvato', 'Order approved'])); },
        { w: 620, ok: L2(['Approva', 'Approve']), onInput: function (e, f) { if (e.target.name === 'acc') { f.querySelector('#impact').innerHTML = impact(e.target.value); var rb = f.querySelector('#rule'); if (rb) rb.outerHTML = apprBox(po, e.target.value); } } });
      var sel = document.querySelector('.modal select[name=acc]'); if (sel) sel.addEventListener('change', function () { document.getElementById('impact').innerHTML = impact(sel.value); var rb = document.getElementById('rule'); if (rb) rb.outerHTML = apprBox(po, sel.value); });
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
      ['qty', 'price', 'd1', 'desc', 'impa', 'note', 'due', 'asset', 'uom', 'oqty', 'cond', 'origin', 'days', 'quoted'].forEach(function (k) { if (String(o[k] == null ? '' : o[k]) !== String(l[k] == null ? '' : l[k])) ch.push(L2(['riga ', 'row ']) + l.row + ' ' + k + (/qty|price|d1/.test(k) ? ' ' + nf(o[k] || 0) + ' → ' + nf(l[k] || 0) : '')); });
    });
    ['incoterm', 'place', 'validTo', 'ref'].forEach(function (k) { if (((a.offer || {})[k] || '') !== ((b.offer || {})[k] || '')) ch.push(L2(['offerta ', 'offer ']) + k); });
    if (JSON.stringify(a.charges || []) !== JSON.stringify(b.charges || [])) ch.push(L2(['spese', 'charges']));
    if ((a.attachments || []).length !== (b.attachments || []).length) ch.push(L2(['allegati ', 'attachments ']) + (a.attachments || []).length + ' → ' + (b.attachments || []).length);
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
    if ((d.type === 'PO' || d.type === 'RFQ') && d.lines) { d.total = docTotal(d); }
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
      cols: { impa: 1, note: 1, asset: 1, cond: 1 } }
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
    var IV = invFor(d.ship, T); if (d.type === 'PO' && (IV.name || IV.address)) { y = box(M, 85, 'Invoice to', [IV.name, IV.address, IV.vat ? 'VAT ' + IV.vat : '', IV.email].filter(Boolean)) + 2; }
    y += 2;
    doc.setFontSize(9); doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal');
    var it = doc.splitTextToSize(pdfTxt(K.intro || ''), W - 2 * M); doc.text(it, M, y); y += it.length * 4 + 3;
    // table
    var C = JSON.parse(JSON.stringify(K.cols || {})), head = ['Row'], body = [];
    if (!d.lines.some(function (l) { return l.asset; })) C.asset = 0;
    if (d.type === 'PO' && !d.lines.some(function (l) { return l.cond; })) C.cond = 0;
    if (C.impa) head.push('Code');
    head.push('Description');
    if (C.asset) head.push('Asset');
    head.push('Qty', 'UOM');
    if (d.type === 'PO') { head.push('Unit price', 'Disc.', 'Amount'); if (C.cond) head.push('Cond.'); }
    else if (C.fill) head.push('Unit price', 'Disc.', 'LT days', 'Cond.');
    d.lines.forEach(function (l) {
      var r = [String(l.row)];
      if (C.impa) r.push(l.impa || (l.code && l.code !== 'GI0001' ? l.code : ''));
      var cd0 = C.impa ? (l.impa || (l.code && l.code !== 'GI0001' ? l.code : '')) : '', nt0 = (l.note || '').split(' · ').filter(function (x) { return !cd0 || x.trim() !== 'P/N ' + cd0; }).join(' · ');
      r.push(pdfTxt(l.desc + (C.note && nt0 ? '\n' + nt0 : '')));
      if (C.asset) r.push(pdfTxt(l.asset || ''));
      r.push((l.qty || 0).toLocaleString('en-GB', { maximumFractionDigits: 2 }), l.uom || '');
      if (d.type === 'PO') { r.push((l.price || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 4 }), l.d1 ? l.d1 + '%' : '', (l.net || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })); if (C.cond) r.push(l.cond || ''); }
      else if (C.fill) r.push('', '', '', '');
      body.push(r);
    });
    doc.autoTable({ startY: y, head: [head], body: body, margin: { left: M, right: M }, theme: 'grid',
      styles: { font: 'helvetica', fontSize: 8, cellPadding: 1.6, lineColor: [210, 210, 210], lineWidth: 0.2, textColor: [30, 30, 30], valign: 'top' },
      headStyles: { fillColor: col, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: (function () { var o = {}, WD = { 'Row': 9, 'Code': 23, 'Asset': 22, 'Qty': 10, 'UOM': 10, 'Unit price': 18, 'Disc.': 10, 'Amount': 19, 'LT days': 12, 'Cond.': 17 }; head.forEach(function (h, i) { o[i] = { cellWidth: WD[h] || 'auto' }; if (/Qty|Unit price|Disc\.|Amount|LT days/.test(h)) o[i].halign = 'right'; }); return o; })(),
      didParseCell: function (c) { if (c.section === 'head' && /Qty|Unit price|Disc\.|Amount|LT days/.test(String(c.cell.raw))) c.cell.styles.halign = 'right'; } });
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
  function buildEml(to, subj, body, pdfB64, name, extra) {
    var bd = '----=_FleetAsset_' + Date.now();
    return ['X-Unsent: 1', 'To: ' + to, 'Subject: ' + encHeader(subj), 'MIME-Version: 1.0', 'Content-Type: multipart/mixed; boundary="' + bd + '"', '',
      '--' + bd, 'Content-Type: text/plain; charset="utf-8"', 'Content-Transfer-Encoding: base64', '', b64utf8(body), '',
      '--' + bd, 'Content-Type: application/pdf; name="' + name + '"', 'Content-Transfer-Encoding: base64', 'Content-Disposition: attachment; filename="' + name + '"', '', pdfB64.replace(/.{76}/g, '$&\r\n'), ''].concat([].concat.apply([], (extra || []).map(function (x) { return ['--' + bd, 'Content-Type: ' + (x.type || 'application/octet-stream') + '; name="' + x.name + '"', 'Content-Transfer-Encoding: base64', 'Content-Disposition: attachment; filename="' + x.name + '"', '', x.b64.replace(/.{76}/g, '$&\r\n'), '']; }))).concat([
      '--' + bd + '--', '']).join('\r\n');
  }
  FORMS.mail = function (d, to) {
    var sh = shipBy(d.ship), rq = d.from && byId(d.from[0]), sp = supById(d.sup) || {};
    var subj = 'M/V ' + sh.name + ' · ' + (d.type === 'RFQ' ? 'RFQ ' : 'PURCHASE ORDER ') + d.num + (d.rev ? ' REV. ' + d.rev : '') + (rq && d.type === 'RFQ' ? ' · ' + rq.num : '') + ' · ' + (sp.name || '');
    var body = d.type === 'RFQ'
      ? 'Dear Sirs,\n\nPlease find attached our Request for Quotation ' + d.num + ' for M/V ' + sh.name + '.\nKindly revert by ' + fd(d.limit) + ' with your best offer, stating price, availability, delivery time, place of origin / stock and condition (Genuine, Non genuine or Reconditioned) for each item.' + (feat('link') ? '\nYou can also enter your quotation online at:\n' + supLink(d) : '') + '\n\nThis inquiry is a request for quotation only and is NOT a purchase order. Kindly quote our RFQ number in all correspondence.\n\nBest regards'
      : 'Dear Sirs,\n\nPlease find attached our Purchase Order ' + d.num + (d.rev ? ' Rev. ' + d.rev + ', which supersedes the previous version' : '') + ' for M/V ' + sh.name + (d.offerRef ? ', as per your quotation ' + d.offerRef : '') + '.\nKindly confirm acceptance, delivery date and dispatch details by return.\n\nBest regards';
    var name = pdfName(d);
    formModal(L2(['Email al fornitore', 'Email to supplier']) + ' · ' + d.num,
      '<label>' + esc(L2(['A', 'To'])) + '<input name="to" type="email" value="' + esc(sp.email || '') + '" placeholder="email@fornitore"></label>' +
      '<label>' + esc(L2(['Oggetto', 'Subject'])) + '<input name="subj" value="' + esc(subj) + '"></label>' +
      '<label>' + esc(L2(['Testo', 'Body'])) + '<textarea name="body" rows="9" class="j" style="font-size:12px">' + esc(body) + '</textarea></label>' +
      '<div class="note" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:var(--ink)"><span>' + esc(L2(['Allegato', 'Attachment'])) + ': <b class="j">' + esc(name) + '</b></span><button type="button" class="btn sm" data-pv="1">' + esc(L2(['Anteprima PDF', 'Preview PDF'])) + '</button></div>' +
      ((d.attachments || []).length ? '<div class="stack" style="gap:4px"><span class="mute" style="font-size:12px">' + esc(L2(['Altri allegati da includere', 'Other attachments to include'])) + '</span>' + d.attachments.map(function (x, i) { return '<label style="flex-direction:row;gap:8px;color:var(--ink);font-size:13px"><input type="checkbox" name="att" value="' + i + '"' + (x.file ? ' checked' : ' disabled') + '> ' + esc(x.name) + ' <span class="mute">' + esc((x.file ? kb(x.file.size) : L2(['file non incluso', 'file not included']))) + '</span></label>'; }).join('') + '</div>' : '') +
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
            var picks = [].map.call(f.querySelectorAll('input[name=att]:checked'), function (c) { return d.attachments[+c.value]; });
            var extra = [];
            Promise.all(picks.map(function (x) { return fileBlob(x.file).then(function (b) { return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { extra.push({ name: (x.file && x.file.name) || x.name, type: b.type || x.file.type, b64: String(fr.result).split(',')[1] }); ok(); }; fr.readAsDataURL(b); }); }).catch(function () { toast(L2(['Allegato non disponibile: ', 'Attachment not available: ']) + x.name); }); })).then(loadPdfLib).then(function () {
              var pdf = buildPdf(d).output('datauristring').split(',')[1];
              var eml = buildEml(f.elements.to.value.trim(), f.elements.subj.value, f.elements.body.value.replace(/\n/g, '\r\n'), pdf, name, extra);
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
      '<div class="filters">' + lab(L2(['Piè di pagina', 'Footer']), inp('footer', T.footer, '', true)) + '</div></section>' + invoiceSection(T) +
      sec('RFQ', L2(['Richiesta di offerta (RFQ)', 'Request for quotation (RFQ)']), colBox('RFQ', 'impa', L2(['Codice (IMPA o del costruttore)', 'Code (IMPA or maker)'])) + colBox('RFQ', 'note', L2(['Nota / P/N', 'Note / P/N'])) + colBox('RFQ', 'asset', 'Asset') + colBox('RFQ', 'fill', L2(['Colonne vuote per il fornitore', 'Blank columns for the supplier']))) +
      sec('PO', L2(['Ordine (PO)', 'Purchase order (PO)']), colBox('PO', 'impa', L2(['Codice (IMPA o del costruttore)', 'Code (IMPA or maker)'])) + colBox('PO', 'note', L2(['Nota / P/N', 'Note / P/N'])) + colBox('PO', 'asset', 'Asset') + colBox('PO', 'cond', L2(['Condizione', 'Condition']))) +
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
    var ci = 0; (DB.items || []).forEach(function (it) { if (ci < 4 && itemText(it).indexOf(q) >= 0) { ci++; out.push({ k: t('stores'), l: (it.impa ? it.impa + ' · ' : '') + it.desc, h: '#/articolo/' + it.id + '?nave=PEP' }); } });
    var tc = 0; (DB.techdocs || []).forEach(function (td) { if (tc < 3 && [td.title, td.maker, td.model, (td.refs || []).join(' ')].join(' ').toUpperCase().indexOf(q) >= 0) { tc++; out.push({ k: L2(['Doc. tecnica', 'Tech doc']), l: td.title, h: '#/documenti?q=' + encodeURIComponent(td.refs && td.refs[0] || td.title) }); } });
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


  /* ---------- fix: offer editing on quoted RFQ ---------- */
  function rfqEditor(d) {
    var o = d.offer || {};
    var rows = d.lines.map(function (l, i) {
      return '<tr><td class="j">' + l.row + '</td><td style="min-width:160px">' + esc(l.desc) + '<div class="mute j" style="font-size:11px">' + nf(l.qty) + ' ' + esc(l.uom) + '</div></td>' +
        '<td><input type="checkbox" data-edit="' + i + '|quoted"' + (l.quoted ? ' checked' : '') + ' aria-label="' + esc(L2(['Quotato', 'Quoted'])) + '"></td>' +
        '<td><input class="j" data-edit="' + i + '|oqty" value="' + nf(l.oqty || l.qty) + '" inputmode="decimal" style="width:70px;text-align:right"></td>' +
        '<td><input class="j" data-edit="' + i + '|price" value="' + nf(l.price || 0) + '" inputmode="decimal" style="width:90px;text-align:right"></td>' +
        '<td><input class="j" data-edit="' + i + '|d1" value="' + nf(l.d1 || 0, 1) + '" inputmode="decimal" style="width:56px;text-align:right"></td>' +
        '<td><select data-edit="' + i + '|cond">' + CONDS.map(function (c) { return '<option' + (l.cond === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></td>' +
        '<td><input data-edit="' + i + '|origin" value="' + esc(l.origin || '') + '" style="width:120px"></td>' +
        '<td><input class="j" data-edit="' + i + '|days" value="' + (l.days == null ? '' : l.days) + '" inputmode="numeric" style="width:52px;text-align:right"></td></tr>';
    }).join('');
    var ch = function (k) { var c = (d.charges || []).filter(function (x) { return x.kind === k; })[0]; return c ? nf(c.amount) : ''; };
    return '<section class="card stack"><h2>' + esc(L2(['Offerta del fornitore', 'Supplier offer'])) + '</h2>' +
      '<div class="note stack" style="gap:8px;color:var(--ink)"><b>' + esc(L2(['Dati comuni a tutte le righe', 'Data common to all rows'])) + '</b><div class="filters">' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">Incoterm<select data-hoffer="incoterm">' + ['', 'EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'DAP', 'DDP'].map(function (x) { return '<option' + (o.incoterm === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Luogo di resa', 'Place'])) + '<input data-hoffer="place" value="' + esc(o.place || '') + '"></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Valida fino al', 'Valid until'])) + '<input type="date" data-hoffer="validTo" value="' + esc(o.validTo || '') + '"></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(t('extRef')) + '<input data-hoffer="ref" value="' + esc(o.ref || '') + '"></label></div><div class="filters">' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Lead time (gg)', 'Lead time (days)'])) + '<input id="rm_days" inputmode="numeric" style="width:70px"></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Condizione', 'Condition'])) + '<select id="rm_cond"><option value="">—</option>' + CONDS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Origine / stock', 'Origin / stock'])) + '<input id="rm_orig"></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(t('l_disc')) + ' %<input id="rm_disc" inputmode="decimal" style="width:60px"></label>' +
      '<button type="button" class="btn" data-act="rfqmass" style="align-self:flex-end">' + esc(L2(['Applica a tutte le righe', 'Apply to all rows'])) + '</button></div></div>' +
      '<div class="tablebox"><table class="grid edit" style="min-width:880px"><thead><tr><th>' + esc(t('l_row')) + '</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(L2(['Quot.', 'Quoted'])) + '</th><th class="num">' + esc(L2(['Q.tà off.', 'Qty off.'])) + '</th><th class="num">' + esc(L2(['Prezzo unit.', 'Unit price'])) + ' ' + esc(d.cur || '') + '</th><th class="num">' + esc(t('l_disc')) + ' %</th><th>' + esc(L2(['Condizione', 'Condition'])) + '</th><th>' + esc(L2(['Origine / stock', 'Origin / stock'])) + '</th><th class="num">LT</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="filters">' + ['transport', 'packing', 'other'].map(function (k) { return '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(t('ch_' + k)) + '<input data-hch="' + k + '" value="' + ch(k) + '" inputmode="decimal" style="width:100px;text-align:right"></label>'; }).join('') + '</div></section>';
  }
  function recalcRfq(d) { d.lines.forEach(function (l) { l.net = l.quoted ? Math.round((l.oqty || l.qty) * (l.price || 0) * disc(l) * 100) / 100 : 0; }); d.total = docTotal(d); }
  CLICK.searchitems = function () { var d = curDoc(); if (d && UI.edit && UI.edit.id === d.id) FORMS.search(d); };
  CLICK.rfqmass = function () {
    var d = curDoc(); if (!d || !UI.edit || UI.edit.id !== d.id) return;
    var dy = document.getElementById('rm_days').value, cd = document.getElementById('rm_cond').value, og = document.getElementById('rm_orig').value.trim(), dc = document.getElementById('rm_disc').value;
    d.lines.forEach(function (l) { if (dy !== '') l.days = parseInt(dy, 10); if (cd) l.cond = cd; if (og) l.origin = og; if (dc !== '') l.d1 = parseNum(dc); });
    recalcRfq(d); UI.edit.dirty = true; render(); toast(L2(['Applicato a tutte le righe', 'Applied to all rows']));
  };

  /* ---------- group C: catalogue search, technical documents, attachments ---------- */
  var IDB = null;
  function idb() {
    if (IDB) return IDB;
    IDB = new Promise(function (ok, ko) { try { var r = indexedDB.open('fa_files', 1); r.onupgradeneeded = function () { r.result.createObjectStore('files'); }; r.onsuccess = function () { ok(r.result); }; r.onerror = function () { ko(r.error); }; } catch (e) { ko(e); } });
    return IDB;
  }
  function idbPut(key, blob) { return idb().then(function (db) { return new Promise(function (ok, ko) { var tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, key); tx.oncomplete = ok; tx.onerror = function () { ko(tx.error); }; }); }); }
  function idbGet(key) { return idb().then(function (db) { return new Promise(function (ok, ko) { var rq = db.transaction('files').objectStore('files').get(key); rq.onsuccess = function () { ok(rq.result); }; rq.onerror = function () { ko(rq.error); }; }); }); }
  function fileBlob(f) {
    if (!f) return Promise.reject(new Error('no file'));
    if (f.src === 'idb') return idbGet(f.key).then(function (b) { if (!b) throw new Error('missing'); return b; });
    if (f.path) return fetch(f.path).then(function (r) { if (!r.ok) throw new Error('missing'); return r.blob(); });
    return Promise.reject(new Error('no file'));
  }
  function kb(n) { return n ? (n > 1048576 ? nf(n / 1048576, 1) + ' MB' : Math.round(n / 1024) + ' KB') : ''; }
  function docsForItem(it) {
    if (!it) return [];
    var pn = (it.pn || it.code || '').toUpperCase(), model = (it.model || '').toUpperCase();
    return (DB.techdocs || []).filter(function (td) {
      return (it.docs || []).indexOf(td.id) >= 0 || (td.refs || []).some(function (r) { r = r.toUpperCase(); return (pn && pn.indexOf(r) === 0) || (model && model === r); });
    });
  }
  function itemText(it) { return [it.impa, it.code, it.pn, it.desc, it.maker, it.model, it.equipment, it.note].filter(Boolean).join(' ').toUpperCase(); }
  function stockAll(itemId) {
    var out = {}; DB.ships.forEach(function (s) { var x = stockOf(s.code)[itemId]; if (x && (x.qty || x.inArr)) out[s.code] = x; }); return out;
  }
  function searchItems(q, f) {
    var words = q.toUpperCase().split(/\s+/).filter(Boolean);
    return (DB.items || []).filter(function (it) {
      var tx = itemText(it);
      if (words.some(function (w) { return tx.indexOf(w) < 0; })) return false;
      if (f.maker && (it.maker || '') !== f.maker) return false;
      if (f.equip && (it.equipment || '') !== f.equip) return false;
      return true;
    }).slice(0, 60);
  }
  function uniq(a) { var o = {}; a.forEach(function (x) { if (x) o[x] = 1; }); return Object.keys(o).sort(); }
  FORMS.search = function (d) {
    var makers = uniq((DB.items || []).map(function (i) { return i.maker; })), equips = uniq((DB.items || []).map(function (i) { return i.equipment; }));
    var sel = {};
    function results(f) {
      var q = f.elements.q.value.trim();
      if (q.length < 2 && !f.elements.maker.value && !f.elements.equip.value) return '<div class="mute" style="padding:10px">' + esc(L2(['Scrivi almeno due caratteri: IMPA, part number, descrizione, maker, modello o equipaggiamento.', 'Type at least two characters: IMPA, part number, description, maker, model or equipment.'])) + '</div>';
      var res = searchItems(q, { maker: f.elements.maker.value, equip: f.elements.equip.value });
      if (!res.length) return '<div class="mute" style="padding:10px">' + esc(t('noResults')) + '</div>';
      return '<table class="grid edit" style="min-width:900px"><thead><tr><th></th><th>IMPA / P/N</th><th>' + esc(t('c_desc')) + '</th><th>Maker / ' + esc(L2(['equipaggiamento', 'equipment'])) + '</th><th>' + esc(L2(['Giacenza per nave', 'Stock per vessel'])) + '</th><th>' + esc(L2(['Ultimo prezzo', 'Last price'])) + '</th><th>Doc</th><th class="num">' + esc(t('l_qty')) + '</th></tr></thead><tbody>' +
        res.map(function (it) {
          var st = stockAll(it.id), stTxt = Object.keys(st).map(function (k) { return k + ' ' + nf(st[k].qty, 0) + (st[k].inArr ? ' (+' + nf(st[k].inArr, 0) + ')' : ''); }).join(' · ') || '—';
          var last = null; DB.ships.forEach(function (s) { var x = stockOf(s.code)[it.id]; if (x && x.last && (!last || x.last.date > last.date)) last = x.last; });
          var nd = docsForItem(it).length;
          return '<tr><td><input type="checkbox" data-pick="' + it.id + '"' + (sel[it.id] ? ' checked' : '') + ' aria-label="' + esc(it.desc) + '"></td><td class="j" style="font-size:12px">' + esc(it.impa || it.pn || it.code || '') + '</td><td>' + esc(it.desc) + (it.note ? '<div class="mute" style="font-size:11px">' + esc(it.note) + '</div>' : '') + '</td>' +
            '<td style="font-size:12px">' + esc([it.maker, it.model].filter(Boolean).join(' ') || '—') + (it.equipment ? '<div class="mute">' + esc(it.equipment) + '</div>' : '') + '</td><td class="j" style="font-size:12px">' + esc(stTxt) + '</td>' +
            '<td class="j" style="font-size:12px">' + (last ? nf(last.price) + ' € · ' + esc(supName(last.sup)) : '—') + '</td><td class="j">' + (nd ? '<span class="chip c-info">' + nd + '</span>' : '') + '</td>' +
            '<td><input data-pq="' + it.id + '" value="' + (sel[it.id] || 1) + '" inputmode="decimal" style="width:60px;text-align:right"></td></tr>';
        }).join('') + '</tbody></table>';
    }
    var form = formModal(L2(['Ricerca articoli', 'Item search']) + ' · ' + d.num,
      '<div class="filters"><input name="q" type="search" placeholder="' + esc(L2(['es. 50801-07H, roller, IMPA 190101, L23/30H', 'e.g. 50801-07H, roller, IMPA 190101, L23/30H'])) + '" style="flex:2;min-width:260px" aria-label="' + esc(t('search')) + '">' +
      '<select name="maker" aria-label="Maker"><option value="">' + esc(L2(['Tutti i maker', 'All makers'])) + '</option>' + makers.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('') + '</select>' +
      '<select name="equip" aria-label="Equipment"><option value="">' + esc(L2(['Tutti gli equipaggiamenti', 'All equipment'])) + '</option>' + equips.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('') + '</select></div>' +
      '<div id="sres" class="tablebox" style="max-height:52vh;overflow:auto"></div><div class="mute" style="font-size:12px" id="scount"></div>',
      function (f) {
        var ids = Object.keys(sel); if (!ids.length) { toast(L2(['Nessun articolo selezionato', 'No item selected'])); return false; }
        var row = d.lines.reduce(function (m, l) { return Math.max(m, l.row); }, 0), props = [];
        ids.forEach(function (id) {
          var it = itemById(id); row += 10;
          d.lines.push({ row: row, item: it.id, code: it.code, impa: it.impa || '', desc: it.desc, note: [it.pn && it.pn !== it.impa ? 'P/N ' + it.pn : '', it.note].filter(Boolean).join(' · '), uom: it.uom || 'PCE', qty: sel[id] || 1, asset: it.equipment || '' });
          docsForItem(it).forEach(function (td) { if (!props.some(function (p) { return p.td.id === td.id; }) && !(d.attachments || []).some(function (a) { return a.td === td.id; })) props.push({ td: td, it: it }); });
        });
        UI.edit.dirty = true; render(); toast(ids.length + ' ' + L2(['righe aggiunte', 'rows added']));
        if (props.length) setTimeout(function () { proposeDocs(d, props); }, 50);
      }, { w: 1100, ok: L2(['Aggiungi alla richiesta', 'Add to requisition']),
        onInput: function (e, f) {
          if (e.target.getAttribute('data-pick')) { var id = e.target.getAttribute('data-pick'); if (e.target.checked) sel[id] = parseNum(f.querySelector('[data-pq="' + id + '"]').value) || 1; else delete sel[id]; f.querySelector('#scount').textContent = Object.keys(sel).length + ' ' + L2(['selezionati', 'selected']); return; }
          if (e.target.getAttribute('data-pq')) { var k = e.target.getAttribute('data-pq'); if (sel[k] != null) sel[k] = parseNum(e.target.value) || 1; return; }
          f.querySelector('#sres').innerHTML = results(f);
        } });
    form.querySelector('#sres').innerHTML = results(form);
  };
  function proposeDocs(d, props) {
    formModal(L2(['Documentazione tecnica trovata', 'Technical documents found']),
      '<div class="mute" style="font-size:13px">' + esc(L2(['Questi documenti sono collegati agli articoli aggiunti. Allegali alla richiesta: passeranno alle RFQ e alle email ai fornitori.', 'These documents are linked to the items added. Attach them to the requisition: they pass to RFQs and supplier emails.'])) + '</div>' +
      props.map(function (p, i) { return '<label style="flex-direction:row;gap:8px;color:var(--ink);align-items:flex-start"><input type="checkbox" name="pd" value="' + i + '" checked> <span><b>' + esc(p.td.title) + '</b><br><span class="mute" style="font-size:12px">' + esc(p.td.kind) + ' · ' + esc(L2(['da', 'from'])) + ' ' + esc(p.it.desc) + (p.td.file ? ' · ' + kb(p.td.file.size) : ' · ' + L2(['file non disponibile in questa versione', 'file not available in this version'])) + '</span></span></label>'; }).join(''),
      function (f) {
        d.attachments = d.attachments || [];
        [].forEach.call(f.querySelectorAll('input[name=pd]:checked'), function (c) { var p = props[+c.value]; d.attachments.push({ id: 'A-' + Date.now() + '-' + c.value, name: p.td.title, kind: p.td.kind, td: p.td.id, file: p.td.file || null, from: p.it.desc, auto: true }); });
        if (UI.edit && UI.edit.id === d.id) UI.edit.dirty = true; else save();
        render();
      }, { ok: L2(['Allega selezionati', 'Attach selected']) });
  }
  function attSection(d) {
    var a = d.attachments || [], ed = UI.edit && UI.edit.id === d.id;
    return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><h2>' + esc(L2(['Allegati', 'Attachments'])) + ' <span class="j mute">' + a.length + '</span></h2>' +
      '<label class="btn sm">' + esc(L2(['Aggiungi file', 'Add file'])) + '<input type="file" multiple hidden data-act="attach"></label></div>' +
      (a.length ? '<div class="stack" style="gap:6px">' + a.map(function (x, i) {
        return '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:6px"><span class="chip ' + (x.auto ? 'c-info' : 'c-neutral') + '">' + esc(x.kind || 'File') + '</span><button class="btn ghost sm" data-act="openatt" data-i="' + i + '" style="text-decoration:underline;color:var(--teal)">' + esc(x.name) + '</button>' +
          '<span class="mute" style="font-size:12px">' + esc(x.auto ? L2(['collegato a ', 'linked to ']) + (x.from || '') : L2(['caricato a mano', 'uploaded manually'])) + (x.file && x.file.size ? ' · ' + kb(x.file.size) : '') + (x.file ? '' : ' · ' + L2(['file non incluso', 'file not included'])) + '</span>' +
          (ed ? '<button class="btn sm ghost" data-act="delatt" data-i="' + i + '" aria-label="remove">✕</button>' : '') + '</div>';
      }).join('') + '</div>' : '<div class="mute" style="font-size:13px">' + esc(L2(['Nessun allegato. Aggiungi foto, tavole o specifiche; dalla ricerca articoli il prototipo propone i documenti collegati.', 'No attachments. Add photos, plates or specs; item search proposes linked documents.'])) + '</div>') + '</section>';
  }
  function openFile(file, name) {
    fileBlob(file).then(function (b) {
      var u = URL.createObjectURL(b), img = /^image\//.test(b.type) || /\.(jpe?g|png)$/i.test(name || '');
      var bg = document.createElement('div'); bg.className = 'modal-bg';
      bg.innerHTML = '<div class="modal" style="width:min(1000px,100%);height:92vh" role="dialog" aria-modal="true" aria-label="' + esc(name) + '"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3>' + esc(name) + '</h3><span style="display:flex;gap:8px"><button class="btn" data-dl="1">' + esc(L2(['Scarica', 'Download'])) + '</button><button class="btn" data-x="1">' + esc(t('close')) + '</button></span></div>' +
        (img ? '<div style="flex:1;overflow:auto;text-align:center"><img src="' + u + '" alt="' + esc(name) + '" style="max-width:100%"></div>' : '<iframe title="' + esc(name) + '" src="' + u + '" style="flex:1;width:100%;border:1px solid var(--line);border-radius:8px;background:#fff"></iframe>') + '</div>';
      document.body.appendChild(bg);
      bg.addEventListener('click', function (e) { if (e.target === bg || e.target.getAttribute('data-x')) { bg.remove(); URL.revokeObjectURL(u); } if (e.target.getAttribute('data-dl')) saveBlob(b, (file && file.name) || name); });
    }).catch(function () { toast(L2(['File non disponibile in questa versione', 'File not available in this version'])); });
  }
  CLICK.openatt = function (a) { var d = curDoc(); var x = d && (d.attachments || [])[+a.getAttribute('data-i')]; if (x) openFile(x.file, x.name); };
  CLICK.delatt = function (a) { var d = curDoc(); if (!d || !UI.edit || UI.edit.id !== d.id) return; d.attachments.splice(+a.getAttribute('data-i'), 1); UI.edit.dirty = true; render(); };
  CLICK.opentd = function (a) { var td = (DB.techdocs || []).filter(function (x) { return x.id === a.getAttribute('data-id'); })[0]; if (td) openFile(td.file, td.title); };
  function uploadFiles(files, cb) {
    var arr = [].slice.call(files || []), out = [];
    (function next(i) {
      if (i >= arr.length) { cb(out); return; }
      var f = arr[i], key = 'F-' + Date.now() + '-' + i;
      idbPut(key, f).then(function () { out.push({ src: 'idb', key: key, name: f.name, size: f.size, type: f.type }); next(i + 1); }).catch(function () { toast(L2(['Impossibile salvare il file nel browser', 'Cannot store the file in the browser'])); next(i + 1); });
    })(0);
  }
  function guessKind(n) { return /\.(jpe?g|png|heic)$/i.test(n) ? L2(['Foto', 'Photo']) : /\.pdf$/i.test(n) ? 'PDF' : 'File'; }
  function pageLibrary(q) {
    var list = (DB.techdocs || []).filter(function (td) { return !q.q || [td.title, td.kind, td.maker, td.model, td.equipment, (td.refs || []).join(' ')].join(' ').toUpperCase().indexOf(q.q.toUpperCase()) >= 0; });
    var body = '<div class="filters"><input type="search" data-filter="q" value="' + esc(q.q || '') + '" placeholder="' + esc(L2(['Cerca per titolo, maker, modello, riferimento tavola', 'Search title, maker, model, plate reference'])) + '" style="flex:1"><button class="btn pri sm" data-act="newtd">' + esc(L2(['Aggiungi documento', 'Add document'])) + '</button></div>' +
      (list.length ? '<div class="tablebox"><table class="grid"><thead><tr><th>' + esc(L2(['Documento', 'Document'])) + '</th><th>' + esc(L2(['Tipo', 'Type'])) + '</th><th>Maker / ' + esc(L2(['modello', 'model'])) + '</th><th>' + esc(L2(['Equipaggiamento', 'Equipment'])) + '</th><th>' + esc(L2(['Riferimenti', 'References'])) + '</th><th>' + esc(L2(['Articoli collegati', 'Linked items'])) + '</th><th></th></tr></thead><tbody>' +
        list.map(function (td) {
          var n = (DB.items || []).filter(function (it) { return docsForItem(it).indexOf(td) >= 0; }).length;
          return '<tr><td><b>' + esc(td.title) + '</b>' + (td.file && td.file.size ? '<div class="mute" style="font-size:11px">' + esc(td.file.name || '') + ' · ' + kb(td.file.size) + '</div>' : '') + '</td><td>' + esc(td.kind) + '</td><td>' + esc([td.maker, td.model].filter(Boolean).join(' ')) + '</td><td>' + esc(td.equipment || '') + (td.ships ? '<div class="mute" style="font-size:11px">' + esc(td.ships.join(', ')) + '</div>' : '') + '</td><td class="j" style="font-size:12px">' + esc((td.refs || []).join(', ')) + '</td><td class="num j">' + n + '</td><td style="white-space:nowrap">' + (td.file ? '<button class="btn sm" data-act="opentd" data-id="' + td.id + '">' + esc(L2(['Apri', 'Open'])) + '</button>' : '<span class="mute" style="font-size:12px">' + esc(L2(['file non incluso', 'file not included'])) + '</span>') + (feat('catalog') && td.parts && td.parts.length ? ' <button class="btn sm pri" data-act="tdparts" data-id="' + td.id + '">' + td.parts.length + ' ' + esc(L2(['ricambi', 'parts'])) + '</button>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty">' + esc(t('noResults')) + '</div>') +
      '<div class="note">' + esc(L2(['Un documento si collega agli articoli il cui part number inizia con uno dei riferimenti (es. 50801-07H) o con lo stesso modello. Nel prototipo i file caricati restano in questo browser; nella versione definitiva staranno su server o SharePoint.', 'A document links to items whose part number starts with one of its references (e.g. 50801-07H) or with the same model. In the prototype uploaded files stay in this browser.'])) + '</div>';
    return shell('documenti', crumb([[t('fleet'), '#/']]), L2(['Documentazione tecnica', 'Technical documentation']), body);
  }
  CLICK.newtd = function () {
    var form = formModal(L2(['Nuovo documento tecnico', 'New technical document']),
      '<label>' + esc(L2(['Titolo', 'Title'])) + '<input name="title" required></label>' +
      '<div class="filters"><label>' + esc(L2(['Tipo', 'Type'])) + '<select name="kind"><option>' + esc(L2(['Tavola ricambi', 'Parts plate'])) + '</option><option>' + esc(L2(['Manuale', 'Manual'])) + '</option><option>' + esc(L2(['Scheda tecnica', 'Data sheet'])) + '</option><option>' + esc(L2(['Catalogo', 'Catalogue'])) + '</option><option>' + esc(L2(['Certificato', 'Certificate'])) + '</option></select></label><label>Maker<input name="maker"></label><label>' + esc(L2(['Modello', 'Model'])) + '<input name="model"></label></div>' +
      '<label>' + esc(L2(['Equipaggiamento', 'Equipment'])) + '<input name="equipment"></label>' +
      '<label>' + esc(L2(['Riferimenti (part number o prefissi, separati da virgola)', 'References (part numbers or prefixes, comma separated)'])) + '<input name="refs" placeholder="50801-07H, 50705-17H"></label>' +
      '<label>' + esc(L2(['File', 'File'])) + '<input type="file" name="file" required></label>',
      function (f) {
        var fl = f.elements.file.files;
        uploadFiles(fl, function (out) {
          DB.techdocs = DB.techdocs || [];
          DB.techdocs.push({ id: 'TD-' + Date.now(), title: f.elements.title.value.trim(), kind: f.elements.kind.value, maker: f.elements.maker.value.trim(), model: f.elements.model.value.trim(), equipment: f.elements.equipment.value.trim(), refs: f.elements.refs.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean), file: out[0] || null });
          save(); render(); toast(L2(['Documento aggiunto', 'Document added']));
        });
      }, { w: 640, ok: L2(['Salva', 'Save']) });
  };

  /* ---------- group D: logistics and tracking ---------- */
  var STAGES = [
    ['prep', ['In preparazione dal fornitore', 'In preparation at supplier'], 'pronta'],
    ['pronta', ['Pronta, ok alla spedizione', 'Ready, cleared to ship'], 'pronta'],
    ['ferma', ['Ferma dal fornitore', 'On hold at supplier'], 'pronta'],
    ['verso_hub', ['Spedita verso hub', 'Shipped to hub'], 'hub'],
    ['in_hub', ['In hub spedizioniere', 'At forwarder hub'], 'hub'],
    ['verso_porto', ['Spedita al porto d\'imbarco', 'Shipped to port of loading'], 'spedita'],
    ['agente', ['Presso agente al porto', 'With port agent'], 'spedita'],
    ['verso_bordo', ['In consegna a bordo', 'Being delivered on board'], 'spedita'],
    ['a_bordo', ['A bordo', 'On board'], 'ricevuta']
  ];
  var CARRIERS = {
    'DHL Express': 'https://www.dhl.com/it-it/home/tracciamento.html?tracking-id=',
    'FedEx': 'https://www.fedex.com/fedextrack/?trknbr=',
    'UPS': 'https://www.ups.com/track?tracknum=',
    'TNT': 'https://www.tnt.com/express/it_it/site/shipping-tools/tracking.html?searchType=con&cons=',
    'Maersk': 'https://www.maersk.com/tracking/',
    'MSC': 'https://www.msc.com/en/track-a-shipment?trackingNumber=',
    'Spedizioniere / hub': '',
    'Altro': ''
  };
  function stageOf(d) {
    if (d.track && d.track.stage) return d.track.stage;
    return { pronta: 'pronta', hub: 'in_hub', spedita: 'verso_bordo', ricevuta: 'a_bordo' }[d.status] || 'prep';
  }
  function stageIdx(k) { for (var i = 0; i < STAGES.length; i++) if (STAGES[i][0] === k) return i; return 0; }
  function url17(n) { return 'https://t.17track.net/it#nums=' + encodeURIComponent(n.replace(/\s+/g, '')); }
  var MON = { gen: 1, jan: 1, feb: 2, mar: 3, apr: 4, mag: 5, may: 5, giu: 6, jun: 6, lug: 7, jul: 7, ago: 8, aug: 8, set: 9, sep: 9, ott: 10, oct: 10, nov: 11, dic: 12, dec: 12 };
  function parseStamp(l) {
    var m, y = +TODAY.slice(0, 4);
    if ((m = l.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/))) return { at: m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4] + ':' + m[5], rest: l.replace(m[0], '') };
    if ((m = l.match(/(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})\s+(\d{1,2}):(\d{2})/))) { var yy = m[3].length === 2 ? 2000 + +m[3] : +m[3]; return { at: yy + '-' + pad(+m[2]) + '-' + pad(+m[1]) + ' ' + pad(+m[4]) + ':' + m[5], rest: l.replace(m[0], '') }; }
    if ((m = l.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(?:(\d{4})\s+)?(\d{1,2}):(\d{2})/)) && MON[m[2].toLowerCase()]) return { at: (m[3] || y) + '-' + pad(MON[m[2].toLowerCase()]) + '-' + pad(+m[1]) + ' ' + pad(+m[4]) + ':' + m[5], rest: l.replace(m[0], '') };
    return null;
  }
  function parseTracking(txt) {
    var lines = txt.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean), ev = [], firstDate = -1;
    lines.forEach(function (l, i) { if (firstDate < 0 && parseStamp(l)) firstDate = i; });
    if (firstDate < 0) return [];
    var after = firstDate > 0;
    for (var i = 0; i < lines.length; i++) {
      var st = parseStamp(lines[i]); if (!st) continue;
      var loc = st.rest.replace(/^[\s·,\-|]+|[\s·,\-|]+$/g, '');
      var txtL = after ? lines[i - 1] : (lines[i + 1] && !parseStamp(lines[i + 1]) ? lines[i + 1] : loc);
      if (after && parseStamp(lines[i - 1] || '')) txtL = loc;
      ev.push({ at: st.at, loc: after ? loc : '', txt: txtL || '' });
    }
    return ev.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  }
  function legStatus(g) { var e = (g.events || [])[0]; if (!e) return ['', 'neutral']; if (/deliver|consegnat|ricevut/i.test(e.txt)) return [L2(['Consegnato', 'Delivered']), 'ok']; if (/hold|ferm|exception|eccezion/i.test(e.txt)) return [L2(['Bloccato', 'On hold']), 'bad']; return [L2(['In transito', 'In transit']), 'info']; }
  function logisticsCard(d) {
    var tr = d.track || { legs: [], events: [] }, cur = stageIdx(stageOf(d)), recv = d.status === 'ricevuta';
    var steps = STAGES.map(function (s, i) {
      var past = i < cur && s[0] !== 'ferma'; var cls = past ? 'c-neutral' : i === cur ? (s[0] === 'ferma' ? 'c-bad' : 'c-acc') : '';
      return '<button type="button" class="chip ' + cls + '" data-act="stage" data-k="' + s[0] + '" style="border:1px solid var(--line2);cursor:pointer;' + (i === cur ? 'font-weight:800' : 'font-weight:500;background:transparent') + '"' + (recv ? ' disabled' : '') + '>' + (past ? '✓ ' : '') + esc(L2(s[1])) + '</button>';
    }).join('');
    var legs = (tr.legs || []).map(function (g, i) {
      var st = legStatus(g), base = CARRIERS[g.carrier] || '', open = UI.legOpen === d.id + i, evs = g.events || [];
      return '<div class="card stack" style="padding:12px 14px;border-left:4px solid ' + (st[1] === 'ok' ? 'var(--green)' : st[1] === 'bad' ? 'var(--red)' : 'var(--teal)') + '">' +
        '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><div><div class="mute" style="font-size:11px;letter-spacing:.06em">' + esc((g.leg || L2(['TRATTA', 'LEG'])).toUpperCase()) + '</div><b>' + esc((g.from || '?') + ' → ' + (g.to || '?')) + '</b></div>' + (st[0] ? '<span class="chip c-' + st[1] + '">' + esc(st[0]) + '</span>' : '') + '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>' + esc(g.carrier) + '</b><span class="chip c-neutral j">' + esc(g.num || '—') + '</span>' +
        (g.num ? '<a class="btn sm" href="' + url17(g.num) + '" target="_blank" rel="noopener">' + esc(L2(['Apri su 17TRACK', 'Open on 17TRACK'])) + '</a>' : '') + (g.num && base ? '<a class="btn sm" href="' + base + encodeURIComponent(g.num.replace(/\s+/g, '')) + '" target="_blank" rel="noopener">' + esc(L2(['Sito vettore', 'Carrier site'])) + '</a>' : '') +
        '<button class="btn sm" data-act="trpaste" data-i="' + i + '">' + esc(L2(['Incolla dati di tracking', 'Paste tracking data'])) + '</button></div>' +
        (evs.length ? '<div class="mute" style="font-size:12px">' + esc(L2(['Ultimo evento', 'Last event'])) + ': ' + esc(evs[0].txt) + ' · ' + esc(evs[0].at) + (evs[0].loc ? ' · ' + esc(evs[0].loc) : '') + '</div>' +
          '<button class="btn ghost sm" data-act="legtoggle" data-i="' + i + '" style="align-self:flex-start;color:var(--teal)">' + esc(open ? L2(['Nascondi timeline', 'Hide timeline']) : L2(['Mostra timeline', 'Show timeline']) + ' (' + evs.length + ')') + '</button>' +
          (open ? '<div class="path">' + evs.map(function (e, j) { return '<div class="st ' + (j === 0 ? 'cur' : 'done') + '"><div class="dotc"><span class="dot"' + (/hold|ferm/i.test(e.txt) ? ' style="background:var(--red);border-color:var(--red)"' : '') + '></span>' + (j < evs.length - 1 ? '<span class="ln"></span>' : '') + '</div><div class="tx"><span class="lb">' + esc(e.txt) + '</span><span class="sb j">' + esc(e.at) + (e.loc ? ' · ' + esc(e.loc) : '') + '</span></div></div>'; }).join('') + '</div>' : '') : '<div class="mute" style="font-size:12px">' + esc(L2(['Nessun evento: apri 17TRACK, copia la cronologia e incollala qui.', 'No events: open 17TRACK, copy the history and paste it here.'])) + '</div>') +
        '</div>';
    }).join('');
    var ev = (tr.events || []).slice().reverse().slice(0, 6).map(function (e) { return '<div><span class="j">' + fd(e.at) + '</span><span>' + esc(e.txt) + (e.loc ? ' · ' + esc(e.loc) : '') + (e.note ? ' · ' + esc(e.note) : '') + '</span></div>'; }).join('');
    return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><h2>' + esc(L2(['Dov\'è la merce', 'Where are the goods'])) + '</h2><button class="btn sm" data-act="legadd">' + esc(L2(['Aggiungi tratta e tracking', 'Add leg and tracking'])) + '</button></div>' +
      (feat('sped') && d.type === 'DN' && shpOf(d.id) ? '<div class="note" style="color:var(--ink)">' + esc(L2(['Viaggia nella spedizione consolidata ', 'Travels in consolidated shipment '])) + '<a href="#/spedizione/' + shpOf(d.id).id + '">' + esc(shpOf(d.id).num) + '</a>' + esc(L2([': tappe e tracking si aggiornano lì.', ': stages and tracking are updated there.'])) + '</div>' : '') +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' + steps + '</div>' + (ev ? '<div class="log">' + ev + '</div>' : '') + legs + '</section>';
  }
  CLICK.stage = function (a) {
    var d = curT(); if (!d) return; var k = a.getAttribute('data-k');
    if (d.dns && k === 'a_bordo') { d.status = 'consegnata'; d.track = d.track || { legs: [], events: [] }; d.track.stage = k; d.track.events = d.track.events || []; d.track.events.push({ at: TODAY, txt: L2(STAGES[stageIdx(k)][1]), loc: '' }); d.log.push({ at: TODAY, to: 'consegnata', txt: L2(['Consegnata a bordo: ora ogni DN va confermata dalla nave', 'Delivered on board: each DN must now be confirmed by the vessel']) }); save(); render(); return; }
    if (k === 'a_bordo') { if (P.seat !== 'ship') { toast(L2(['La conferma a bordo spetta alla nave: passa alla postazione Bordo.', 'On-board confirmation is done by the vessel: switch to Vessel station.'])); return; } receiveModal(d); return; }
    formModal(L2(['Aggiorna posizione merce', 'Update goods position']) + ' · ' + L2(STAGES[stageIdx(k)][1]),
      '<div class="filters"><label>' + esc(t('c_date')) + '<input type="date" name="at" value="' + TODAY + '"></label><label>' + esc(L2(['Luogo', 'Place'])) + '<input name="loc"></label></div><label>' + esc(t('note')) + '<input name="note"></label>',
      function (f) {
        d.track = d.track || { legs: [], events: [] }; d.track.events = d.track.events || [];
        d.log = d.log || []; d.track.stage = k; d.track.events.push({ at: f.elements.at.value || TODAY, txt: L2(STAGES[stageIdx(k)][1]), loc: f.elements.loc.value.trim(), note: f.elements.note.value.trim() });
        var to = STAGES[stageIdx(k)][2];
        if (d.dns) { d.log.push({ at: TODAY, to: d.status, txt: L2(STAGES[stageIdx(k)][1]) + (f.elements.loc.value ? ' · ' + f.elements.loc.value : '') }); d.dns.forEach(function (id) { var x = byId(id); if (!x || x.status === 'ricevuta') return; x.track = x.track || { legs: [], events: [] }; x.track.stage = k; if (to !== x.status) setStatus(x, to, L2(STAGES[stageIdx(k)][1]) + ' · ' + d.num); }); save(); render(); return; }
        if (to !== d.status && d.status !== 'ricevuta') setStatus(d, to, L2(STAGES[stageIdx(k)][1]) + (f.elements.loc.value ? ' · ' + f.elements.loc.value : ''));
        else d.log.push({ at: TODAY, to: d.status, txt: L2(STAGES[stageIdx(k)][1]) + (f.elements.loc.value ? ' · ' + f.elements.loc.value : '') });
        save(); render();
      }, { ok: L2(['Aggiorna', 'Update']) });
  };
  CLICK.legadd = function () {
    var d = curT(); if (!d) return;
    formModal(L2(['Nuova tratta', 'New leg']),
      '<div class="filters"><label>' + esc(L2(['Tratta', 'Leg'])) + '<select name="leg"><option>' + esc(L2(['Fornitore → hub', 'Supplier → hub'])) + '</option><option>' + esc(L2(['Hub → porto / agente', 'Hub → port / agent'])) + '</option><option>' + esc(L2(['Agente → bordo', 'Agent → vessel'])) + '</option><option>' + esc(L2(['Fornitore → bordo', 'Supplier → vessel'])) + '</option></select></label>' +
      '<label>' + esc(L2(['Vettore', 'Carrier'])) + '<select name="carrier">' + Object.keys(CARRIERS).concat((DB.settings && DB.settings.forwarders) || []).map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></label></div>' +
      '<label>' + esc(L2(['Numero di tracking / AWB / B/L', 'Tracking / AWB / B/L number'])) + '<input name="num"></label>' +
      '<div class="filters"><label>' + esc(L2(['Da', 'From'])) + '<input name="from" value="' + esc(d.dns ? d.hub || '' : supName(d.sup)) + '"></label><label>' + esc(L2(['A', 'To'])) + '<input name="to" value="' + esc(d.dns ? d.port || 'M/V ' + shipBy(d.ship).name : d.hub || '') + '"></label></div>',
      function (f) {
        d.track = d.track || { legs: [], events: [] }; d.track.legs = d.track.legs || [];
        d.log = d.log || []; d.track.legs.push({ leg: f.elements.leg.value, carrier: f.elements.carrier.value, num: f.elements.num.value.trim(), from: f.elements.from.value.trim(), to: f.elements.to.value.trim(), events: [] });
        d.log.push({ at: TODAY, to: d.status, txt: L2(['Tracking ', 'Tracking ']) + f.elements.carrier.value + ' ' + f.elements.num.value.trim() });
        save(); render();
      }, { ok: L2(['Aggiungi', 'Add']) });
  };
  CLICK.trpaste = function (a) {
    var d = curT(); if (!d) return; var g = d.track.legs[+a.getAttribute('data-i')];
    formModal(L2(['Incolla dati di tracking', 'Paste tracking data']) + ' · ' + g.carrier + ' ' + g.num,
      '<div class="mute" style="font-size:13px">' + esc(L2(['Su 17TRACK o sul sito del vettore seleziona la cronologia degli eventi, copia e incolla qui. Il prototipo riconosce date e ore e ricostruisce la timeline.', 'On 17TRACK or the carrier site select the event history, copy and paste here. Dates and times are recognised to rebuild the timeline.'])) + '</div><textarea name="txt" rows="12" class="j" style="font-size:12px"></textarea>',
      function (f) {
        var ev = parseTracking(f.elements.txt.value);
        if (!ev.length) { toast(L2(['Nessuna data riconosciuta nel testo', 'No date recognised in the text'])); return false; }
        d.log = d.log || []; g.events = ev; g.updated = TODAY; UI.legOpen = d.id + a.getAttribute('data-i');
        d.log.push({ at: TODAY, to: d.status, txt: g.carrier + ' ' + g.num + ': ' + ev.length + ' ' + L2(['eventi', 'events']) + ' · ' + ev[0].txt });
        save(); render(); toast(ev.length + ' ' + L2(['eventi importati', 'events imported']));
      }, { w: 720, ok: L2(['Aggiorna timeline', 'Update timeline']) });
  };
  CLICK.legtoggle = function (a) { var d = curT(); var k = d.id + a.getAttribute('data-i'); UI.legOpen = UI.legOpen === k ? null : k; render(); };
  function pageLogistics(q) {
    var nave = q.nave || '';
    var cols = [
      ['sup', ['Dal fornitore', 'At supplier'], ['prep', 'pronta', 'ferma']],
      ['hub', ['Verso / in hub', 'To / at hub'], ['verso_hub', 'in_hub']],
      ['port', ['Porto, agente, consegna', 'Port, agent, delivery'], ['verso_porto', 'agente', 'verso_bordo']],
      ['board', ['A bordo (ultimi 30 gg)', 'On board (last 30 days)'], ['a_bordo']]
    ];
    var from30 = addDays(TODAY, -30);
    var dns = docs(function (d) { return d.type === 'DN' && (!nave || d.ship === nave) && !d.stale && !(feat('sped') && shpOf(d.id)) && (isOpen(d) || (d.status === 'ricevuta' && (lastLogDate(d) || d.date) >= from30)); });
    var shs = feat('sped') ? shipments().filter(function (x) { return (!nave || x.ship === nave) && (x.status !== 'consegnata' || (lastLogDate(x) || '') >= from30); }) : [];
    function shpCard(x) { var g = (x.track.legs || []).slice(-1)[0]; return '<a href="#/spedizione/' + x.id + '" class="card stack" style="padding:10px 12px;gap:4px;text-decoration:none;color:var(--ink);border-left:4px solid var(--acc)"><div style="display:flex;justify-content:space-between;gap:6px"><span class="j" style="font-size:12px;color:var(--teal);font-weight:600">' + esc(x.num) + '</span><span class="code j">' + x.ship + '</span></div><b style="font-size:13px">' + esc(L2(['Spedizione consolidata · ', 'Consolidated shipment · '])) + x.dns.length + ' DN</b><span class="mute" style="font-size:12px">' + esc([x.hub, x.port].filter(Boolean).join(' → ')) + '</span><span style="font-size:12px">' + esc(L2(STAGES[stageIdx(stageOf(x))][1])) + '</span>' + (g ? '<span class="j" style="font-size:11px">' + esc(g.carrier + ' ' + (g.num || '')) + '</span>' : '') + (x.due ? '<span class="j mute" style="font-size:11px">ETA ' + fd(x.due) + '</span>' : '') + '</a>'; }
    var waiting = docs(function (d) { return d.type === 'PO' && (!nave || d.ship === nave) && { inviato: 1, confermato: 1, finalizzato: 1 }[d.status] && !children(d.id).some(function (x) { return x.type === 'DN'; }); });
    function card(d) {
      var st = stageOf(d), legs = (d.track && d.track.legs) || [], g = legs[legs.length - 1];
      return '<a href="#/doc/' + d.id + '" class="card stack" style="padding:10px 12px;gap:4px;text-decoration:none;color:var(--ink)"><div style="display:flex;justify-content:space-between;gap:6px"><span class="j" style="font-size:12px;color:var(--teal);font-weight:600">' + esc(d.num) + '</span>' + COLS.ship.v(d) + '</div>' +
        '<b style="font-size:13px">' + esc(d.desc) + '</b><span class="mute" style="font-size:12px">' + esc(supName(d.sup)) + '</span>' +
        '<span style="font-size:12px">' + esc(L2(STAGES[stageIdx(st)][1])) + (isLate(d) ? ' · <span class="t-bad">' + esc(t('late')) + '</span>' : '') + '</span>' +
        (g ? '<span class="j" style="font-size:11px">' + esc(g.carrier + ' ' + (g.num || '')) + (g.events && g.events[0] ? ' · ' + esc(g.events[0].txt) : '') + '</span>' : '') + (d.due ? '<span class="j mute" style="font-size:11px">ETA ' + fd(d.due) + '</span>' : '') + '</a>';
    }
    var shipOpts = DB.ships.map(function (s) { return '<option value="' + s.code + '"' + (nave === s.code ? ' selected' : '') + '>' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('');
    var board = '<div style="overflow-x:auto"><div style="display:grid;grid-template-columns:repeat(5,minmax(230px,1fr));gap:12px;min-width:1180px;align-items:start">' +
      '<div class="stack"><h3 style="margin:0;font-size:14px">' + esc(L2(['Ordinato, senza DN', 'Ordered, no DN'])) + ' <span class="j mute">' + waiting.length + '</span></h3>' + waiting.sort(function (a, b) { return (a.due || '') < (b.due || '') ? -1 : 1; }).slice(0, 12).map(function (d) {
        return '<a href="#/doc/' + d.id + '" class="card stack" style="padding:10px 12px;gap:4px;text-decoration:none;color:var(--ink)"><div style="display:flex;justify-content:space-between;gap:6px"><span class="j" style="font-size:12px;color:var(--teal);font-weight:600">' + esc(d.num) + '</span>' + COLS.ship.v(d) + '</div><b style="font-size:13px">' + esc(d.desc) + '</b><span class="mute" style="font-size:12px">' + esc(supName(d.sup)) + ' · ' + esc(stLabel(d)) + '</span><span class="j ' + (isLate(d) ? 't-bad' : 'mute') + '" style="font-size:11px">' + esc(L2(['Consegna', 'Delivery'])) + ' ' + fd(d.due) + '</span></a>';
      }).join('') + (waiting.length > 12 ? '<a class="btn sm" href="#/docs' + qs({ tipo: 'PO', nave: nave, aperti: 1 }) + '">' + esc(L2(['Altri ', 'Other '])) + (waiting.length - 12) + ' →</a>' : '') + '</div>' +
      cols.map(function (c) {
        var ds = dns.filter(function (d) { return c[2].indexOf(stageOf(d)) >= 0; }).sort(function (a, b) { return (a.due || '') < (b.due || '') ? -1 : 1; });
        var sx = shs.filter(function (x) { return c[2].indexOf(stageOf(x)) >= 0; });
        return '<div class="stack"><h3 style="margin:0;font-size:14px">' + esc(L2(c[1])) + ' <span class="j mute">' + (ds.length + sx.length) + '</span></h3>' + sx.map(shpCard).join('') + ds.slice(0, 12).map(card).join('') + (ds.length > 12 ? '<a class="btn sm" href="#/docs' + qs({ tipo: 'DN', nave: nave, aperti: 1 }) + '">' + esc(L2(['Altre ', 'Other '])) + (ds.length - 12) + ' →</a>' : '') + '</div>';
      }).join('') + '</div></div>';
    return shell('logistica', crumb([[t('fleet'), '#/']]), L2(['Logistica', 'Logistics']) + (nave ? ' · ' + nave : ''),
      '<div class="filters"><select data-filter="nave" aria-label="' + esc(t('c_ship')) + '"><option value="">' + esc(t('allShips')) + '</option>' + shipOpts + '</select><span class="mute" style="font-size:12px;flex:1">' + esc(L2(['Ordini inviati senza consegna aperta, poi ogni consegna per tappa. Clic per aprire.', 'Sent orders with no delivery yet, then each delivery by stage. Click to open.'])) + '</span>' + (feat('sped') ? '<button class="btn pri sm" data-act="shpnew">' + esc(L2(['Nuova spedizione consolidata', 'New consolidated shipment'])) + '</button>' : '') + '</div>' + board);
  }
  function lastLogDate(d) { var l = d.log || []; return l.length ? l[l.length - 1].at : null; }


  /* =====================================================================
     PROPOSTE (20-10-2026): ogni proposta ha un interruttore in #/proposte
     ===================================================================== */
  var FLAGS = [
    ['oggi', ['Coda "Oggi" come pagina iniziale', 'Today queue as home page'], ['La giornata parte da ciò che è fermo e chiede una decisione, per tutta la flotta. Ogni voce ha l\'azione a un clic e "Rimanda". La Flotta resta nel menu.', 'The day starts from what is blocked and needs a decision.'], ['Oggi: la pagina iniziale è la Flotta con i KPI per nave.', 'Today: home is the Fleet with KPIs per vessel.'], '#/'],
    ['menu', ['Menu raggruppato', 'Grouped menu'], ['Voci del menu divise per area (Acquisti, Bordo, Controllo). Lo Scadenzario confluisce in "Oggi".', 'Menu items grouped by area.'], ['Oggi: 13 voci in fila.', 'Today: 13 items in a row.'], '#/'],
    ['approv', ['Approvazione a regole', 'Rule-based approval'], ['Sotto una soglia e dentro il budget del conto l\'ordine si approva da solo; sopra serve una persona con nome; fuori budget l\'armatore.', 'Below a threshold and within budget the order approves itself; above, a named person.'], ['Oggi: approva chiunque.', 'Today: anyone approves.'], '#/docs?tipo=PO&stato=bozza'],
    ['landed', ['Costo arrivato a bordo', 'Landed cost on board'], ['In comparazione, accanto al prezzo, il costo stimato a bordo: trasporto per zona di origine, hub, dogana extra-UE, oppure il rapporto storico delle fatture di quel fornitore. Nuova proposta "Miglior costo a bordo".', 'In the comparison, the estimated landed cost next to the price.'], ['Oggi: si confronta il prezzo; le spese extra si scoprono in fattura.', 'Today: price only; extras show up on the invoice.'], '#/doc/DEMO-RQ'],
    ['score', ['Scheda fornitore automatica', 'Automatic supplier scorecard'], ['Voto A/B/C calcolato dai documenti: risposta alle RFQ, puntualità degli ordini, lead time promesso. Compare in comparazione e nella pagina del fornitore.', 'A/B/C grade computed from documents.'], ['Oggi: valutazione a memoria.', 'Today: from memory.'], '#/fornitori'],
    ['link', ['Link offerta per il fornitore', 'Supplier quotation link'], ['Ogni RFQ ha un link: il fornitore compila prezzi, LT, condizione, origine e Incoterm in una pagina web; l\'offerta entra da sola in comparazione.', 'Each RFQ has a link; the supplier fills in the offer online.'], ['Oggi: l\'offerta arriva in PDF e si ribatte a mano.', 'Today: offer arrives as PDF and is retyped.'], '#/doc/HQS000000007694'],
    ['qr', ['Ricevimento a bordo con QR', 'On-board receipt with QR'], ['Etichetta con QR per ogni consegna. A bordo si inquadra col telefono, si contano i pezzi, si fotografa la DN firmata. Le DN scadute senza conferma finiscono nei solleciti.', 'QR label per delivery; the ship scans, counts and photographs the signed DN.'], ['Oggi: conferma dalla postazione Bordo; 87 consegne su 92 mai confermate.', 'Today: confirmation from the Vessel station; 87 of 92 never confirmed.'], '#/doc/HQS000000007512'],
    ['sped', ['Spedizioni consolidate', 'Consolidated shipments'], ['Più consegne (DN) viaggiano insieme hub → nave in una Spedizione con un solo tracking. I costi di trasporto si ripartiscono sulle DN e vanno a budget (Logistic and packing).', 'Several DNs travel together hub → vessel with one tracking; freight costs are split and booked.'], ['Oggi: tracking e tappe su ogni singola DN.', 'Today: tracking on each DN.'], '#/logistica'],
    ['catalog', ['Catalogo dalle tavole', 'Catalogue from parts plates'], ['Le tavole dei costruttori diventano elenchi ricambi con P/N da confermare. Sulle righe senza codice la richiesta propone l\'articolo a catalogo più simile.', 'Maker plates become parts lists; generic lines get a catalogue suggestion.'], ['Oggi: un terzo delle righe con codice generico GI0001.', 'Today: a third of lines with generic code GI0001.'], '#/documenti']
  ];
  function feat(k) { if (HIDDEN[k]) return false; return !P.flags || P.flags[k] !== false; }
  function setts(path, def) { var o = DB.settings || {}, p = path.split('.'); for (var i = 0; i < p.length; i++) { if (o == null) return def; o = o[p[i]]; } return o == null ? def : o; }
  function aset(path, v) { DB.settings = DB.settings || {}; var o = DB.settings, p = path.split('.'); for (var i = 0; i < p.length - 1; i++) o = o[p[i]] = o[p[i]] || {}; o[p[p.length - 1]] = v; save(); }
  CLICK.flag = function (a) { P.flags = P.flags || {}; P.flags[a.getAttribute('data-k')] = a.checked; savePrefs(); render(); };
  CLICK.flagsall = function (a) { P.flags = {}; var v = a.getAttribute('data-v') === '1'; FLAGS.forEach(function (f) { P.flags[f[0]] = v; }); savePrefs(); render(); toast(v ? L2(['Tutte le proposte accese', 'All proposals on']) : L2(['Versione attuale: proposte spente', 'Current version: proposals off'])); };
  function pageProposals() {
    var cards = FLAGS.map(function (f) {
      var o = feat(f[0]);
      return '<section class="card stack" style="gap:8px;' + (o ? 'border-color:var(--accLine)' : '') + '"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">' +
        '<h2 style="margin:0">' + esc(L2(f[1])) + '</h2><label class="tog" style="white-space:nowrap"><input type="checkbox" data-act="flag" data-k="' + f[0] + '"' + (o ? ' checked' : '') + '> ' + esc(o ? L2(['Accesa', 'On']) : L2(['Spenta', 'Off'])) + '</label></div>' +
        '<div style="font-size:13px;line-height:1.5">' + esc(L2(f[2])) + '</div><div class="mute" style="font-size:12px">' + esc(L2(f[3])) + '</div>' +
        '<a class="btn sm" style="align-self:flex-start" href="' + f[4] + '">' + esc(L2(['Guardala', 'See it'])) + ' →</a></section>';
    }).join('');
    var A = setts('approval', {}), Lc = setts('landed', {});
    var num = function (path, v, w) { return '<input class="j" data-aset="' + path + '" value="' + nf(v, v % 1 ? 1 : 0) + '" inputmode="decimal" style="width:' + (w || 90) + 'px;text-align:right">'; };
    var params = '<section class="card stack"><h2>' + esc(L2(['Parametri delle proposte', 'Proposal parameters'])) + '</h2>' +
      '<div class="filters"><label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Approvazione automatica fino a (€)', 'Auto approval up to (€)'])) + num('approval.auto', A.auto) + '</label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Approvatore', 'Approver'])) + '<input data-asett="approval.mgr" value="' + esc(A.mgr || '') + '" style="width:180px"></label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['fino a (€)', 'up to (€)'])) + num('approval.mgrMax', A.mgrMax) + '</label>' +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Oltre o fuori budget', 'Above or off budget'])) + '<input data-asett="approval.top" value="' + esc(A.top || '') + '" style="width:160px"></label></div>' +
      '<div class="filters">' + ['EU', 'EXTRA', 'ASIA'].map(function (z) { return '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Trasporto ', 'Freight ']) + z + ' %') + num('landed.' + z + '.pct', (Lc[z] || {}).pct, 60) + '</label><label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['minimo €', 'min €'])) + num('landed.' + z + '.min', (Lc[z] || {}).min, 70) + '</label>'; }).join('') +
      '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Hub / handling €', 'Hub / handling €'])) + num('landed.hub', Lc.hub, 70) + '</label><label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(L2(['Dogana extra-UE %', 'Non-EU customs %'])) + num('landed.customs', Lc.customs, 60) + '</label></div>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['Valori di prova da tarare con le vostre fatture. Se un fornitore ha già fatture con spese, il costo a bordo usa il suo rapporto storico.', 'Test values to calibrate with your invoices.'])) + '</div></section>';
    var body = '<div class="note" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:var(--ink)"><span style="flex:1;min-width:240px">' + esc(L2(['Ogni proposta si accende e si spegne qui, solo su questo computer. Spente tutte, l\'app torna esattamente come prima.', 'Each proposal is switched here, on this computer only. All off = previous version.'])) + '</span>' +
      '<button class="btn" data-act="flagsall" data-v="0">' + esc(L2(['Versione attuale (tutte spente)', 'Current version (all off)'])) + '</button><button class="btn pri" data-act="flagsall" data-v="1">' + esc(L2(['Tutte accese', 'All on'])) + '</button></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">' + cards + '</div>' + params;
    return shell('proposte', crumb([[t('fleet'), '#/']]), L2(['Proposte', 'Proposals']), body);
  }

  /* ---------- rail (normale o raggruppato) ---------- */
  function railHtmlOld(active, ship) {
    var home = feat('oggi');
    var E = {
      oggi: ['#/', 'cal', L2(['Oggi', 'Today']), active === 'oggi'],
      flotta: [home ? '#/flotta' : '#/', 'fleet', t('fleet'), active === 'home' || active === 'ship'],
      acq: ['#/docs' + qs({ tipo: 'RQ', nave: ship }), 'cart', t('purchasing'), active === 'docs' || active === 'doc'],
      pms: ['#/modulo/pms', 'gear', t('pms'), active === 'pms'],
      log: ['#/logistica' + qs({ nave: ship }), 'cal', L2(['Logistica', 'Logistics']), active === 'logistica'],
      mag: ['#/magazzino' + qs({ nave: ship || 'PEP' }), 'box', t('stores'), active === 'magazzino'],
      doc: ['#/documenti', 'doc', L2(['Documenti', 'Documents']), active === 'documenti'],
      cert: ['#/modulo/certificati', 'doc', t('certs'), active === 'certificati'],
      due: ['#/scadenze' + qs({ nave: ship }), 'cal', t('due'), active === 'scadenze'],
      bud: ['#/budget' + qs({ nave: ship || 'PEP' }), 'chart', t('budget'), active === 'budget'],
      sup: ['#/fornitori', 'ppl', t('suppliers'), active === 'fornitori'],
      acc: ['#/contabilita', 'doc', L2(['Contabilità', 'Accounting']), active === 'contabilita'],
      prop: ['#/proposte', 'gear', L2(['Proposte', 'Proposals']), active === 'proposte'],
      tpl: ['#/impostazioni', 'doc', L2(['Modelli', 'Templates']), active === 'impostazioni'],
      dati: ['#/dati', 'db', t('data'), active === 'dati']
    };
    function L(k) { var e = E[k]; return railLink(e[0], e[1], e[2], e[3]); }
    function G(l) { return '<div class="grp">' + esc(l) + '</div>'; }
    var top = (home ? L('oggi') : '') + L('flotta');
    var mid = feat('menu')
      ? G(L2(['ACQUISTI', 'PURCHASING'])) + L('acq') + L('sup') + L('log') + G(L2(['BORDO', 'VESSEL'])) + L('mag') + L('pms') + L('cert') + L('doc') + G(L2(['CONTROLLO', 'CONTROL'])) + L('bud') + L('acc') + (home ? '' : L('due'))
      : L('acq') + L('pms') + L('log') + L('mag') + L('doc') + L('cert') + L('due') + L('bud') + L('sup') + L('acc');
    return '<nav class="rail' + (feat('menu') ? ' grouped' : '') + '" aria-label="' + esc(t('fleet')) + '"><div class="brand">' + esc(ship || 'FLEET') + '</div>' + top + mid +
      '<div class="sp"></div>' + L('prop') + L('tpl') + L('dati') + '</nav>';
  }

  /* ---------- 1. coda Oggi ---------- */
  function snoozed(d) { return DB.snooze && DB.snooze[d.id] && DB.snooze[d.id] > TODAY; }
  function staleDn(d) { return d.type === 'DN' && isOpen(d) && d.due && d.due < addDays(TODAY, -30); }
  var QG = [
    ['eval', ['Offerte arrivate da valutare', 'Offers to evaluate']],
    ['appr', ['Ordini da approvare', 'Orders to approve']],
    ['send', ['Ordini approvati da inviare', 'Approved orders to send']],
    ['new', ['Richieste nuove da bordo', 'New requisitions from vessels']],
    ['rfq', ['RFQ oltre il limite senza risposta', 'RFQs past limit, no answer']],
    ['po', ['Ordini in ritardo', 'Late orders']],
    ['dn', ['Consegne non confermate a bordo', 'Deliveries not confirmed on board']],
    ['inv', ['Da fatturare', 'To invoice']]
  ];
  function todayItems(nave) {
    var out = [], ok = function (d) { return (!nave || d.ship === nave) && !snoozed(d) && !d.stale; };
    docs(function (d) { return d.type === 'RQ' && ok(d) && d.status === 'endorsed'; }).forEach(function (d) { out.push({ g: 'new', d: d, why: L2(['Endorsed da bordo il ', 'Endorsed on board on ']) + fd(d.date), age: daysBetween(d.date, TODAY), act: { l: L2(['Prendi in carico', 'Take over']), qadv: 'verifica' } }); });
    docs(function (d) { return d.type === 'RQ' && ok(d) && (d.status === 'quotazione' || d.status === 'quotata'); }).forEach(function (d) {
      var rf = children(d.id).filter(function (x) { return x.type === 'RFQ'; }), q = rf.filter(function (x) { return x.status === 'quotata'; }).length, w = rf.filter(function (x) { return x.status === 'inviata'; }).length;
      if (q) out.push({ g: 'eval', d: d, why: q + '/' + rf.length + ' ' + L2(['offerte arrivate', 'offers in']) + (w ? ' · ' + w + ' ' + L2(['in attesa', 'pending']) : ''), age: daysBetween(d.date, TODAY), act: { l: L2(['Confronta e scegli', 'Compare and pick']), href: '#/doc/' + d.id } });
    });
    docs(function (d) { return d.type === 'PO' && ok(d) && d.status === 'bozza'; }).forEach(function (d) {
      var r = feat('approv') ? apprRule(d, defAccount(d)) : null;
      out.push({ g: 'appr', d: d, why: money(d.total, d.cur) + (r ? ' · ' + L2(['approva: ', 'approver: ']) + r.who : ''), age: daysBetween(d.date, TODAY), act: { l: L2(['Apri e approva', 'Open and approve']), href: '#/doc/' + d.id } });
    });
    docs(function (d) { return d.type === 'PO' && ok(d) && (d.status === 'approvato' || d.needResend); }).forEach(function (d) { out.push({ g: 'send', d: d, why: d.needResend ? 'Rev. ' + d.rev + ' ' + L2(['da rimandare', 'to resend']) : money(d.total, d.cur), age: daysBetween(d.date, TODAY), act: { l: L2(['Apri e invia', 'Open and send']), href: '#/doc/' + d.id } }); });
    docs(function (d) { return d.type === 'RFQ' && ok(d) && d.status === 'inviata' && d.limit && d.limit < TODAY; }).forEach(function (d) { out.push({ g: 'rfq', d: d, why: L2(['limite ', 'limit ']) + fd(d.limit) + (d.chased ? ' · ' + L2(['sollecitata il ', 'chased on ']) + fd(d.chased) : ''), age: daysBetween(d.limit, TODAY), act: { l: L2(['Sollecita', 'Chase']), chase: 1 } }); });
    docs(function (d) { return d.type === 'PO' && ok(d) && isOpen(d) && isLate(d); }).forEach(function (d) { out.push({ g: 'po', d: d, why: L2(['consegna prevista ', 'due ']) + fd(d.due) + (d.chased ? ' · ' + L2(['sollecitato il ', 'chased on ']) + fd(d.chased) : ''), age: daysBetween(d.due, TODAY), act: { l: L2(['Sollecita', 'Chase']), chase: 1 } }); });
    docs(function (d) { return d.type === 'DN' && ok(d) && d.status === 'spedita' && d.due && d.due <= addDays(TODAY, -3) && !staleDn(d); }).forEach(function (d) { out.push({ g: 'dn', d: d, why: L2(['a bordo previsto ', 'due on board ']) + fd(d.due) + (d.chased ? ' · ' + L2(['sollecitata il ', 'chased on ']) + fd(d.chased) : ''), age: daysBetween(d.due, TODAY), act: { l: L2(['Sollecita la nave', 'Chase the vessel']), chase: 1 } }); });
    var toInv = docs(function (d) { return d.type === 'DN' && d.status === 'ricevuta' && (!nave || d.ship === nave) && !docs(function (x) { return x.type === 'FT' && x.from && x.from.indexOf(d.id) >= 0; }).length; });
    if (toInv.length) out.push({ g: 'inv', d: null, why: toInv.length + ' ' + L2(['consegne ricevute senza fattura registrata', 'received deliveries without invoice']), age: 0, act: { l: L2(['Apri Contabilità', 'Open Accounting']), href: '#/contabilita' } });
    return out;
  }
  function pageToday(q) {
    var nave = q.nave || '', items = todayItems(nave);
    var stale = docs(function (d) { return staleDn(d) && !d.stale && (!nave || d.ship === nave); });
    var chips = '<div style="display:flex;gap:6px;flex-wrap:wrap"><a class="chip ' + (!nave ? 'c-acc' : 'c-neutral') + '" href="#/">' + esc(L2(['Tutta la flotta', 'Whole fleet'])) + '</a>' + DB.ships.filter(function (s) { return s.infoship; }).map(function (s) { var n = todayItems(s.code).length; return '<a class="chip ' + (nave === s.code ? 'c-acc' : 'c-neutral') + '" href="#/?nave=' + s.code + '">' + s.code + ' · ' + n + '</a>'; }).join('') + '</div>';
    var kp = '<div class="kpis">' + [['eval', 'appr', 'send'], ['new'], ['rfq', 'po'], ['dn']].map(function (gs, i) {
      var n = items.filter(function (x) { return gs.indexOf(x.g) >= 0; }).length;
      var lab = [L2(['Decisioni da prendere', 'Decisions to make']), L2(['Richieste nuove', 'New requisitions']), L2(['Fornitori da sollecitare', 'Suppliers to chase']), L2(['Navi da sollecitare', 'Vessels to chase'])][i];
      return '<a class="kpi" href="#q-' + gs[0] + '" data-act="qjump" data-k="' + gs[0] + '"><span class="l">' + esc(lab) + '</span><span class="n j">' + n + '</span><span class="s t-' + (n ? 'warn' : 'mute') + '">' + esc(n ? L2(['da fare', 'to do']) : L2(['niente da fare', 'nothing to do'])) + '</span></a>';
    }).join('') + '</div>';
    var groups = QG.map(function (g) {
      var it = items.filter(function (x) { return x.g === g[0]; }).sort(function (a, b) { return b.age - a.age; });
      if (!it.length) return '';
      return '<section class="card stack" id="q-' + g[0] + '" style="gap:0"><div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:8px"><h2>' + esc(L2(g[1])) + ' <span class="j mute">' + it.length + '</span></h2></div>' +
        it.slice(0, UI.qAll && UI.qAll[g[0]] ? 999 : 8).map(qRow).join('') +
        (it.length > 8 && !(UI.qAll && UI.qAll[g[0]]) ? '<button class="btn ghost sm" data-act="qmore" data-k="' + g[0] + '" style="align-self:flex-start;margin-top:8px;color:var(--teal)">' + esc(L2(['Mostra tutte', 'Show all'])) + ' (' + it.length + ')</button>' : '') + '</section>';
    }).join('');
    var staleBox = stale.length ? '<section class="card stack" style="border-style:dashed"><h2>' + esc(L2(['Pulizia dati', 'Data clean-up'])) + ' <span class="j mute">' + stale.length + '</span></h2><div style="font-size:13px">' + esc(L2(['Consegne con arrivo previsto da oltre 30 giorni e mai confermate. Probabilmente sono a bordo da tempo: tenerle aperte rende rosso tutto il resto.', 'Deliveries due over 30 days ago and never confirmed.'])) + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn sm" href="#/docs' + qs({ tipo: 'DN', nave: nave, aperti: 1, late: 1 }) + '">' + esc(L2(['Vedi elenco', 'See list'])) + '</a><button class="btn sm" data-act="stalearchive" data-nave="' + nave + '">' + esc(L2(['Archivia come storiche', 'Archive as historical'])) + '</button></div><div class="mute" style="font-size:12px">' + esc(L2(['Archiviare le toglie dalle code; restano aperte e consultabili. Si annulla con "Ripristina dati".', 'Archiving removes them from queues; they stay open.'])) + '</div></section>' : '';
    var body = chips + kp + (groups || '<div class="card"><div class="empty">' + esc(L2(['Niente in coda. Buon lavoro.', 'Queue empty.'])) + '</div></div>') + staleBox;
    var title = new Date().toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long' });
    return shell('oggi', esc(title), L2(['Oggi', 'Today']) + (nave ? ' · ' + nave : ''), '<div class="stack" style="gap:14px">' + body + '</div>');
  }
  function qRow(x) {
    var d = x.d;
    var btn = x.act.href ? '<a class="btn pri sm" href="' + x.act.href + '">' + esc(x.act.l) + '</a>' : x.act.qadv ? '<button class="btn pri sm" data-act="qadv" data-id="' + d.id + '" data-to="' + x.act.qadv + '">' + esc(x.act.l) + '</button>' : '<button class="btn pri sm" data-act="chase" data-id="' + d.id + '">' + esc(x.act.l) + '</button>';
    return '<div class="qrow">' + (d ? '<a href="#/doc/' + d.id + '" class="j" style="font-size:12px;color:var(--teal);font-weight:600;white-space:nowrap">' + esc(d.num) + '</a>' + COLS.ship.v(d) : '<span></span><span></span>') +
      '<div style="min-width:0"><div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(d ? d.desc : '') + '</div><div class="mute" style="font-size:12px">' + esc((d && d.sup ? supName(d.sup) + ' · ' : '') + x.why) + '</div></div>' +
      '<span class="j ' + (x.age > 14 ? 't-bad' : 'mute') + '" style="font-size:12px;white-space:nowrap">' + (x.age > 0 ? x.age + ' gg' : '') + '</span>' +
      '<span style="display:flex;gap:6px;justify-content:flex-end">' + btn + (d ? '<button class="btn sm ghost" data-act="snooze" data-id="' + d.id + '" title="' + esc(L2(['Rimanda di 3 giorni', 'Snooze 3 days'])) + '">' + esc(L2(['Rimanda', 'Snooze'])) + '</button>' : '') + '</span></div>';
  }
  CLICK.qmore = function (a) { UI.qAll = UI.qAll || {}; UI.qAll[a.getAttribute('data-k')] = 1; render(); };
  CLICK.qjump = function (a, r) { var el = document.getElementById('q-' + a.getAttribute('data-k')); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
  CLICK.snooze = function (a) { DB.snooze = DB.snooze || {}; DB.snooze[a.getAttribute('data-id')] = addDays(TODAY, 3); save(); render(); toast(L2(['Rimandato di 3 giorni', 'Snoozed 3 days'])); };
  CLICK.qadv = function (a) { var d = byId(a.getAttribute('data-id')); if (!d) return; setStatus(d, a.getAttribute('data-to'), L2(['dalla coda Oggi', 'from Today queue'])); save(); render(); toast(d.num + ' · ' + stLabel(d)); };
  CLICK.stalearchive = function (a) {
    var nave = a.getAttribute('data-nave'), ds = docs(function (d) { return staleDn(d) && !d.stale && (!nave || d.ship === nave); });
    formModal(L2(['Archivia consegne storiche', 'Archive historical deliveries']), '<div style="font-size:13px">' + ds.length + ' ' + esc(L2(['consegne con arrivo previsto da oltre 30 giorni escono dalle code e dai rossi. Restano consultabili.', 'deliveries leave the queues.'])) + '</div>',
      function () { ds.forEach(function (d) { d.stale = true; d.log = d.log || []; d.log.push({ at: TODAY, to: d.status, txt: L2(['Archiviata come storica (pulizia dati)', 'Archived as historical']) }); }); save(); render(); toast(ds.length + ' ' + L2(['archiviate', 'archived'])); }, { ok: L2(['Archivia', 'Archive']) });
  };
  CLICK.chase = function (a) {
    var d = byId(a.getAttribute('data-id')); if (!d) return;
    var sh = shipBy(d.ship), sp = supById(d.sup) || {}, to, subj, body;
    if (d.type === 'DN') { to = ''; subj = 'M/V ' + sh.name + ' · DELIVERY ' + d.num + ' · CONFIRMATION OF RECEIPT'; body = 'Dear Captain / Chief Engineer,\n\nAs per our records, delivery ' + d.num + ' (' + d.desc + ') from ' + supName(d.sup) + ' was due on board on ' + fd(d.due) + '.\nKindly confirm receipt and return the stamped and signed delivery note, or advise if the goods have not been received.\n\nBest regards'; }
    else if (d.type === 'RFQ') { to = sp.email || ''; subj = 'REMINDER · RFQ ' + d.num + ' · M/V ' + sh.name; body = 'Dear Sirs,\n\nWith reference to our Request for Quotation ' + d.num + ' for M/V ' + sh.name + ' sent on ' + fd(d.sentAt || d.date) + ', we have not yet received your quotation.\nKindly revert with your best offer, or let us know if you are unable to quote.\n\nBest regards'; }
    else { to = sp.email || ''; subj = 'REMINDER · PURCHASE ORDER ' + d.num + ' · M/V ' + sh.name; body = 'Dear Sirs,\n\nWith reference to our Purchase Order ' + d.num + ' for M/V ' + sh.name + ', the agreed delivery date was ' + fd(d.due) + '.\nKindly advise the current status and the new estimated ready date.\n\nBest regards'; }
    formModal(L2(['Sollecito', 'Reminder']) + ' · ' + d.num,
      '<label>' + esc(L2(['A', 'To'])) + '<input name="to" value="' + esc(to) + '"></label><label>' + esc(L2(['Oggetto', 'Subject'])) + '<input name="subj" value="' + esc(subj) + '"></label><label>' + esc(L2(['Testo', 'Body'])) + '<textarea name="body" rows="8" class="j" style="font-size:12px">' + esc(body) + '</textarea></label>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['Copia il testo o scarica la bozza Outlook, poi segna come sollecitato: la voce sparisce dalla coda per 3 giorni.', 'Copy or download the Outlook draft, then mark as chased.'])) + '</div>',
      function (f) { d.chased = TODAY; d.log = d.log || []; d.log.push({ at: TODAY, to: d.status, txt: L2(['Sollecito', 'Reminder']) + (f.elements.to.value ? ' · ' + f.elements.to.value : '') }); DB.snooze = DB.snooze || {}; DB.snooze[d.id] = addDays(TODAY, 3); save(); render(); toast(L2(['Sollecito registrato', 'Reminder logged'])); },
      { w: 680, ok: L2(['Segna come sollecitato', 'Mark as chased']), extra: '<button type="button" class="btn" data-eml="1">' + esc(L2(['Bozza Outlook (.eml)', 'Outlook draft (.eml)'])) + '</button><button type="button" class="btn" data-copy="1">' + esc(L2(['Copia testo', 'Copy text'])) + '</button>',
        onClick: function (e, f) {
          if (e.target.getAttribute('data-copy')) { try { navigator.clipboard.writeText(f.elements.subj.value + '\n\n' + f.elements.body.value).then(function () { toast(L2(['Testo copiato', 'Text copied'])); }); } catch (x) { f.elements.body.select(); } }
          if (e.target.getAttribute('data-eml')) { var bd = '----=_FA_' + Date.now(); var eml = ['X-Unsent: 1', 'To: ' + f.elements.to.value, 'Subject: ' + encHeader(f.elements.subj.value), 'MIME-Version: 1.0', 'Content-Type: text/plain; charset="utf-8"', 'Content-Transfer-Encoding: base64', '', b64utf8(f.elements.body.value.replace(/\n/g, '\r\n'))].join('\r\n'); saveBlob(new Blob([eml], { type: 'message/rfc822' }), 'Sollecito_' + d.num.replace(/\//g, '-') + '.eml'); }
        } });
  };

  /* ---------- 2. approvazione a regole ---------- */
  function defAccount(po) {
    if (po.account) return po.account;
    var pa = postable(po.ship), pref = po.dept === 'DECK' ? '00-2-' : '00-3-';
    return (pa.filter(function (a) { return a.path.indexOf(pref) === 0; })[0] || pa[0] || {}).path;
  }
  function apprRule(po, acc) {
    var A = setts('approval', {}), poE = toEur(po.total || 0, po.cur), v = (budgetAgg(po.ship)[acc] || { b: 0, o: 0, d: 0 });
    var left = v.b - v.o - v.d, inBud = v.b > 0 && poE <= left;
    if (poE <= (A.auto || 0) && inBud) return { lvl: 0, who: L2(['Regola automatica', 'Automatic rule']), why: L2(['sotto ', 'below ']) + money(A.auto, 'EUR') + L2([' e dentro il budget del conto', ' and within account budget']) };
    if (poE <= (A.mgrMax || 0) && inBud) return { lvl: 1, who: A.mgr || '—', why: L2(['sopra ', 'above ']) + money(A.auto, 'EUR') + L2([', dentro il budget', ', within budget']) };
    return { lvl: 2, who: A.top || '—', why: !inBud ? (v.b ? L2(['supera il residuo del conto (', 'exceeds account remaining (']) + money(left, 'EUR') + ')' : L2(['conto senza budget', 'account without budget'])) : L2(['sopra ', 'above ']) + money(A.mgrMax, 'EUR') };
  }
  function apprBox(po, acc) {
    var r = apprRule(po, acc);
    return '<div id="rule" class="note" style="color:var(--ink);border-left:4px solid ' + (r.lvl === 0 ? 'var(--green)' : r.lvl === 1 ? 'var(--teal)' : 'var(--red)') + '"><b>' + esc(L2(['Chi approva: ', 'Approver: ']) + r.who) + '</b><br><span style="font-size:12px">' + esc(L2(['Regola: ', 'Rule: ']) + r.why) + '</span></div>';
  }
  function autoApprove(po) {
    var acc = defAccount(po), r = apprRule(po, acc);
    if (r.lvl === 0) { po.account = acc; setStatus(po, 'approvato', L2(['Approvazione automatica · ', 'Automatic approval · ']) + r.why + ' · ' + acc); return true; }
    return false;
  }

  /* ---------- 3. costo arrivato a bordo ---------- */
  var RX_ASIA = /korea|corea|china|cina|japan|giappone|singapore|taiwan|hong ?kong|busan|shanghai|india|vietnam|malaysia|thailand|indonesia|uae|dubai|asia/i;
  var RX_EU = /ital|genova|genoa|napoli|naples|spezia|livorno|trieste|venezia|ravenna|rotterdam|netherland|olanda|german|hamburg|bremen|france|francia|marseille|spain|spagna|barcelona|valencia|greece|grecia|piraeus|denmark|copenhagen|belgi|antwerp|poland|sweden|finland|portugal|malta|croatia|austria|europe|\beu\b/i;
  function zoneOf(r) {
    var tx = [(r.offer || {}).place].concat((r.lines || []).map(function (l) { return l.origin; })).filter(Boolean).join(' ');
    if (RX_ASIA.test(tx)) return 'ASIA'; if (RX_EU.test(tx)) return 'EU';
    if (tx) return 'EXTRA'; return r.cur === 'USD' ? 'ASIA' : 'EU';
  }
  function supExtraRatio(sid) {
    var g = 0, c = 0; docs(function (d) { return d.type === 'FT' && d.sup === sid; }).forEach(function (f) { g += toEur(f.goods || 0, f.cur); (f.charges || []).forEach(function (x) { c += toEur(x.amount || 0, f.cur); }); });
    return g > 0 ? c / g : null;
  }
  function landed(r) {
    var Lc = setts('landed', {}), z = zoneOf(r), inc = (r.offer || {}).incoterm || 'EXW', incl = /^(CFR|CIF|CPT|DAP|DDP)$/.test(inc);
    var goods = (r.lines || []).reduce(function (a, x) { return a + (x.quoted ? offerEur(r, x) : 0); }, 0); if (!goods) return null;
    var ch = toEur((r.charges || []).reduce(function (a, c) { return a + (c.amount || 0); }, 0), r.cur);
    var hist = supExtraRatio(r.sup), zc = Lc[z] || {};
    var freight = incl ? 0 : hist != null ? goods * hist : Math.max(zc.min || 0, goods * (zc.pct || 0) / 100);
    var hub = Lc.hub || 0, cust = z !== 'EU' && inc !== 'DDP' ? goods * (Lc.customs || 0) / 100 : 0;
    var tot = goods + ch + freight + hub + cust;
    return { tot: tot, f: tot / goods, goods: goods, ch: ch, freight: freight, hub: hub, cust: cust, z: z, inc: inc, hist: hist };
  }
  function landedFoot(r) {
    var x = landed(r); if (!x) return '';
    return '<span title="' + esc(x.inc + ' · ' + x.z + ' · ' + L2(['trasporto ', 'freight ']) + nf(x.freight, 0) + (x.hist != null ? L2([' (storico fatture)', ' (invoice history)']) : '') + ' · hub ' + nf(x.hub, 0) + (x.cust ? ' · ' + L2(['dogana ', 'customs ']) + nf(x.cust, 0) : '') + (x.ch ? ' · ' + L2(['spese offerta ', 'offer charges ']) + nf(x.ch, 0) : '')) + '" style="margin-top:4px;padding:6px 8px;border-radius:8px;background:var(--accSoft);display:flex;flex-direction:column;gap:1px"><span style="font-size:11px;font-weight:700;letter-spacing:.04em">' + esc(L2(['A BORDO STIMATO', 'LANDED ESTIMATE'])) + '</span><span class="j" style="font-weight:700">' + money(x.tot, 'EUR') + '</span>' +
'</span>';
  }

  /* ---------- 4. scheda fornitore ---------- */
  function supScore(sid) {
    var rf = docs(function (d) { return d.type === 'RFQ' && d.sup === sid; });
    var ans = rf.filter(function (d) { return d.status === 'quotata'; }).length, ref = rf.filter(function (d) { return d.status === 'rifiutata'; }).length, over = rf.filter(function (d) { return d.status === 'inviata' && d.limit && d.limit < TODAY; }).length;
    var den = ans + ref + over, resp = den ? ans / den : null;
    var po = docs(function (d) { return d.type === 'PO' && d.sup === sid && d.status !== 'annullato' && d.due; });
    var late = po.filter(function (d) { return isLate(d) || (d.status === 'finalizzato' && children(d.id).some(function (x) { return x.type === 'DN' && x.date > d.due; })); }).length;
    var punct = po.length ? 1 - late / po.length : null;
    var lts = []; rf.forEach(function (d) { (d.lines || []).forEach(function (l) { if (l.quoted && l.days != null) lts.push(l.days); }); });
    var lt = lts.length ? Math.round(lts.reduce(function (a, b) { return a + b; }, 0) / lts.length) : null;
    var parts = [resp, punct].filter(function (x) { return x != null; }), sc = parts.length ? parts.reduce(function (a, b) { return a + b; }, 0) / parts.length : null;
    var n = den + po.length;
    return { resp: resp, punct: punct, lt: lt, n: n, grade: sc == null || n < 3 ? '?' : sc >= 0.8 ? 'A' : sc >= 0.6 ? 'B' : 'C', ans: ans, den: den, po: po.length, late: late };
  }
  function scoreBadge(sid, full) {
    var s = supScore(sid), tone = s.grade === 'A' ? 'ok' : s.grade === 'B' ? 'warn' : s.grade === 'C' ? 'bad' : 'neutral';
    return '<span style="display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:11px"><span class="chip c-' + tone + '" title="' + esc(L2(['Voto calcolato dai documenti', 'Grade computed from documents'])) + '">' + s.grade + '</span>' +
      '<span class="mute">' + esc(L2(['risp. ', 'resp. ']) + (s.resp == null ? '—' : Math.round(s.resp * 100) + '%') + ' · ' + L2(['puntual. ', 'on time ']) + (s.punct == null ? '—' : Math.round(s.punct * 100) + '%') + (full && s.lt != null ? ' · LT ' + s.lt + ' gg' : '')) + '</span></span>';
  }
  function scoreCard(sid) {
    var s = supScore(sid);
    return '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2>' + esc(L2(['Scheda automatica', 'Automatic scorecard'])) + '</h2>' + scoreBadge(sid, true) + '</div>' +
      '<dl class="kv"><dt>' + esc(L2(['Risposta alle RFQ', 'RFQ response'])) + '</dt><dd class="j">' + s.ans + ' / ' + s.den + (s.resp != null ? ' · ' + Math.round(s.resp * 100) + '%' : '') + '</dd>' +
      '<dt>' + esc(L2(['Ordini puntuali', 'Orders on time'])) + '</dt><dd class="j">' + (s.po - s.late) + ' / ' + s.po + (s.punct != null ? ' · ' + Math.round(s.punct * 100) + '%' : '') + '</dd>' +
      '<dt>' + esc(L2(['Lead time medio promesso', 'Average promised LT'])) + '</dt><dd class="j">' + (s.lt != null ? s.lt + ' gg' : '—') + '</dd>' +
      '<dt>' + esc(L2(['Spese extra in fattura', 'Invoice extras'])) + '</dt><dd class="j">' + (supExtraRatio(sid) != null ? nf(supExtraRatio(sid) * 100, 1) + '%' : '—') + '</dd></dl>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['A da 80%, B da 60%. "?" con meno di 3 documenti. Media di risposta e puntualità.', 'A from 80%, B from 60%. "?" with fewer than 3 documents.'])) + '</div></section>';
  }

  /* ---------- 5. link offerta fornitore ---------- */
  function supLink(d) { return location.href.split('#')[0] + '#/offerta/' + d.id; }
  CLICK.suplink = function () {
    var d = curDoc(); if (!d) return; var u = supLink(d);
    formModal(L2(['Link offerta per il fornitore', 'Supplier quotation link']) + ' · ' + d.num,
      '<div style="font-size:13px">' + esc(L2(['Il fornitore apre il link, compila l\'offerta e la invia: entra da sola in comparazione. Nessun login, scade al limite offerta.', 'The supplier opens the link, fills in and sends the offer.'])) + '</div>' +
      '<input readonly value="' + esc(u) + '" class="j" style="font-size:12px" onclick="this.select()">' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['Nel prototipo il link funziona solo su questo computer (i dati sono nel browser). Il link va anche nel testo dell\'email RFQ.', 'In the prototype the link works only on this computer.'])) + '</div>',
      function () { location.hash = '#/offerta/' + d.id; }, { ok: L2(['Apri come fornitore', 'Open as supplier']), extra: '<button type="button" class="btn" data-copy="1">' + esc(L2(['Copia link', 'Copy link'])) + '</button>', onClick: function (e) { if (e.target.getAttribute('data-copy')) { try { navigator.clipboard.writeText(u).then(function () { toast(L2(['Link copiato', 'Link copied'])); }); } catch (x) {} } } });
  };
  function pageSupplierQuote(id) {
    var d = byId(id), co = setts('company', {}) || {};
    function wrap(inner) { return '<div class="sq"><header class="sq-h"><div><b>' + esc(co.name || 'Purchasing') + '</b><div class="mute" style="font-size:12px">' + esc(co.email || '') + '</div></div><span class="chip c-neutral">Supplier quotation form</span></header>' + inner + '</div>'; }
    if (!d || d.type !== 'RFQ') return wrap('<div class="card"><div class="empty">This link is not valid.</div></div>');
    if (UI.sqDone === d.id) return wrap('<section class="card stack" style="text-align:center;align-items:center;padding:40px"><div style="font-size:40px">✓</div><h2>Thank you, your quotation has been received.</h2><div class="mute">RFQ ' + esc(d.num) + ' · ' + money(d.total, d.cur) + '</div><a class="btn" href="#/doc/' + d.id + '">' + esc(L2(['Torna al prototipo (vista ufficio)', 'Back to the prototype (office view)'])) + '</a></section>');
    if (!{ creata: 1, inviata: 1, quotata: 1 }[d.status]) return wrap('<div class="card"><div class="empty">This request for quotation is closed.</div></div>');
    var o = d.offer || {}, sh = shipBy(d.ship);
    var rows = d.lines.map(function (l, i) {
      return '<tr><td class="j">' + l.row + '</td><td style="min-width:150px"><b>' + esc(l.desc) + '</b>' + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') + (l.impa ? '<div class="mute j" style="font-size:11px">IMPA ' + esc(l.impa) + '</div>' : '') + '</td><td class="num j">' + nf(l.qty) + ' ' + esc(l.uom) + '</td>' +
        '<td><input type="checkbox" name="qt' + i + '"' + (l.quoted !== false ? ' checked' : '') + ' aria-label="quoted"></td>' +
        '<td><input name="oq' + i + '" value="' + nf(l.oqty || l.qty) + '" inputmode="decimal" style="width:70px;text-align:right"></td>' +
        '<td><input name="pr' + i + '" value="' + (l.price ? nf(l.price) : '') + '" inputmode="decimal" style="width:90px;text-align:right" placeholder="0,00"></td>' +
        '<td><input name="ds' + i + '" value="' + (l.d1 ? nf(l.d1, 1) : '') + '" inputmode="decimal" style="width:56px;text-align:right"></td>' +
        '<td><select name="cd' + i + '">' + ['Genuine', 'Non genuine', 'Usato'].map(function (c) { return '<option value="' + c + '"' + (l.cond === c ? ' selected' : '') + '>' + (c === 'Usato' ? 'Used / reconditioned' : c) + '</option>'; }).join('') + '</select></td>' +
        '<td><input name="or' + i + '" value="' + esc(l.origin || '') + '" style="width:110px" placeholder="e.g. Busan"></td>' +
        '<td><input name="lt' + i + '" value="' + (l.days == null ? '' : l.days) + '" inputmode="numeric" style="width:56px;text-align:right"></td></tr>';
    }).join('');
    var ch = function (k) { var c = (d.charges || []).filter(function (x) { return x.kind === k; })[0]; return c ? nf(c.amount) : ''; };
    var lab = function (l, inner) { return '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + l + inner + '</label>'; };
    return wrap('<section class="card stack"><h1 class="h1" style="font-size:22px">Request for quotation ' + esc(d.num) + '</h1>' +
      '<div class="mute" style="font-size:13px">M/V ' + esc(sh.name) + ' · ' + esc(d.desc) + ' · for ' + esc(supName(d.sup)) + ' · please quote by <b>' + fd(d.limit) + '</b> · currency <b>' + esc(d.cur) + '</b></div>' +
      (d.status === 'quotata' ? '<div class="note">Quotation already received' + (o.date ? ' on ' + fd(o.date) : '') + '. You can update it until the deadline.</div>' : '') +
      '</section><form id="sqform" data-id="' + d.id + '" class="stack" style="gap:14px"><section class="card stack"><h2>Offer terms</h2><div class="filters">' +
      lab('Incoterm', '<select name="inco">' + ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'DAP', 'DDP'].map(function (x) { return '<option' + (o.incoterm === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select>') +
      lab('Place', '<input name="place" value="' + esc(o.place || '') + '" placeholder="e.g. Busan, Genoa">') + lab('Valid until', '<input type="date" name="valid" value="' + esc(o.validTo || addDays(TODAY, 30)) + '">') + lab('Your reference', '<input name="ref" value="' + esc(o.ref || '') + '">') + '</div>' +
      '<div class="filters" style="align-items:flex-end">' + lab('Lead time for all items (days)', '<input id="sq_lt" inputmode="numeric" style="width:80px">') + lab('Condition for all items', '<select id="sq_cd"><option value="">—</option><option value="Genuine">Genuine</option><option value="Non genuine">Non genuine</option><option value="Usato">Used / reconditioned</option></select>') + lab('Origin / stock for all items', '<input id="sq_or">') +
      '<button type="button" class="btn" data-act="sqmass">Apply to all items</button></div></section>' +
      '<section class="card stack"><h2>Items</h2><div class="tablebox"><table class="grid edit" style="min-width:900px"><thead><tr><th>Row</th><th>Description</th><th class="num">Qty req.</th><th>Quote</th><th class="num">Qty off.</th><th class="num">Unit price ' + esc(d.cur) + '</th><th class="num">Disc. %</th><th>Condition</th><th>Origin / stock</th><th class="num">LT days</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="filters">' + lab('Transport', '<input name="ch_transport" value="' + ch('transport') + '" inputmode="decimal" style="width:100px;text-align:right">') + lab('Packing', '<input name="ch_packing" value="' + ch('packing') + '" inputmode="decimal" style="width:100px;text-align:right">') + lab('Other charges', '<input name="ch_other" value="' + ch('other') + '" inputmode="decimal" style="width:100px;text-align:right">') + lab('Your quotation (PDF, optional)', '<input type="file" name="file">') + '</div></section>' +
      '<div style="display:flex;justify-content:flex-end;gap:8px"><button class="btn pri" type="submit">Send quotation</button></div></form>');
  }
  CLICK.sqmass = function () {
    var f = document.getElementById('sqform'); if (!f) return; var d = byId(f.getAttribute('data-id'));
    var lt = document.getElementById('sq_lt').value, cd = document.getElementById('sq_cd').value, og = document.getElementById('sq_or').value;
    d.lines.forEach(function (l, i) { if (lt !== '') f.elements['lt' + i].value = lt; if (cd) f.elements['cd' + i].value = cd; if (og) f.elements['or' + i].value = og; });
    toast('Applied to all items');
  };
  function submitSupplierQuote(f) {
    var d = byId(f.getAttribute('data-id')); if (!d) return;
    var any = false;
    d.lines.forEach(function (l, i) {
      l.quoted = f.elements['qt' + i].checked && parseNum(f.elements['pr' + i].value) > 0;
      l.oqty = parseNum(f.elements['oq' + i].value) || l.qty; l.price = parseNum(f.elements['pr' + i].value); l.d1 = parseNum(f.elements['ds' + i].value); l.d2 = 0;
      l.cond = f.elements['cd' + i].value; l.origin = f.elements['or' + i].value.trim(); var lt = f.elements['lt' + i].value.trim(); l.days = lt === '' ? null : parseInt(lt, 10);
      l.net = l.quoted ? Math.round(l.oqty * l.price * (1 - l.d1 / 100) * 100) / 100 : 0; if (l.quoted) any = true;
    });
    if (!any) { toast('Please enter at least one unit price'); return; }
    d.charges = ['transport', 'packing', 'other'].map(function (k) { return { kind: k, amount: parseNum(f.elements['ch_' + k].value) }; }).filter(function (c) { return c.amount; });
    var was = d.status === 'quotata';
    d.offer = { ref: f.elements.ref.value.trim(), date: TODAY, validTo: f.elements.valid.value, days: f.elements.valid.value ? daysBetween(TODAY, f.elements.valid.value) : 30, incoterm: f.elements.inco.value, place: f.elements.place.value.trim(), via: 'link' };
    d.total = docTotal(d);
    var done = function () {
      if (was) { d.log.push({ at: TODAY, to: d.status, txt: L2(['Offerta aggiornata dal fornitore tramite link · ', 'Offer updated by supplier via link · ']) + money(d.total, d.cur) }); }
      else setStatus(d, 'quotata', L2(['Offerta inserita dal fornitore tramite link · ', 'Offer entered by supplier via link · ']) + money(d.total, d.cur));
      UI.sqDone = d.id; save(); render(); window.scrollTo(0, 0);
    };
    if (f.elements.file.files.length) uploadFiles(f.elements.file.files, function (out) { d.attachments = d.attachments || []; out.forEach(function (x) { d.attachments.push({ id: 'A-' + x.key, name: L2(['Offerta fornitore: ', 'Supplier offer: ']) + x.name, kind: 'PDF', file: x }); }); done(); });
    else done();
  }

  /* ---------- 6. QR e ricevimento a bordo ---------- */
  var qrP = null;
  function loadQr() { if (window.qrcode) return Promise.resolve(); if (qrP) return qrP; qrP = new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = 'lib/qrcode.js'; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); return qrP; }
  function qrSvg(text, cell) { var q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell || 4, margin: 2, scalable: true }); }
  function rcvLink(d) { return location.href.split('#')[0] + '#/ricevi/' + d.id; }
  function qrCard(d) {
    var recv = d.status === 'ricevuta';
    return '<section class="card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div data-qr="' + esc(rcvLink(d)) + '" style="width:112px;height:112px;background:#fff;border-radius:8px;padding:4px;flex:0 0 auto"></div>' +
      '<div class="stack" style="gap:6px;flex:1;min-width:220px"><h2 style="margin:0">' + esc(L2(['Etichetta collo e ricevimento con QR', 'Package label and QR receipt'])) + '</h2>' +
      '<div style="font-size:13px">' + esc(recv ? L2(['Ricevuta a bordo.', 'Received on board.']) : L2(['Stampa l\'etichetta e mandala al fornitore o all\'hub da applicare sul collo. A bordo si inquadra il QR col telefono: conta, foto della DN firmata, conferma.', 'Print the label for the package. On board, scan the QR: count, photo of the signed DN, confirm.'])) + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="qrprint">' + esc(L2(['Stampa etichetta', 'Print label'])) + '</button>' + (recv ? '' : '<a class="btn sm pri" href="#/ricevi/' + d.id + '">' + esc(L2(['Apri la pagina di bordo', 'Open vessel page'])) + '</a>') + '</div></div></section>';
  }
  function afterRender() {
    var els = document.querySelectorAll('[data-qr]'); if (!els.length) return;
    loadQr().then(function () { [].forEach.call(els, function (el) { el.innerHTML = qrSvg(el.getAttribute('data-qr')); var s = el.querySelector('svg'); if (s) { s.setAttribute('width', '100%'); s.setAttribute('height', '100%'); } }); }).catch(function () {});
  }
  CLICK.qrprint = function () {
    var d = curDoc(); if (!d) return; var po = d.from && byId(d.from[0]), sh = shipBy(d.ship);
    loadQr().then(function () {
      var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(d.num) + '</title><style>body{font-family:Helvetica,Arial,sans-serif;margin:0}.l{width:100mm;height:70mm;border:1px dashed #999;box-sizing:border-box;padding:5mm;display:flex;gap:4mm}.q{width:40mm;height:40mm}.q svg{width:100%;height:100%}h1{font-size:18pt;margin:0}p{margin:1mm 0;font-size:10pt}</style></head><body><div class="l"><div class="q">' + qrSvg(rcvLink(d), 6) + '</div><div><h1>M/V ' + esc(sh.name) + '</h1><p><b>DN ' + esc(d.num) + '</b></p><p>PO ' + esc(po ? po.num : '—') + '</p><p>' + esc(supName(d.sup)) + '</p><p>' + esc(d.desc) + '</p><p style="font-size:8pt;margin-top:3mm">Scan on board to confirm receipt</p></div></div></body></html>';
      var fr = document.createElement('iframe'); fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(fr);
      fr.contentDocument.open(); fr.contentDocument.write(html); fr.contentDocument.close();
      setTimeout(function () { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { toast('Stampa non disponibile'); } setTimeout(function () { fr.remove(); }, 2000); }, 300);
    });
  };
  function pageReceive(id) {
    var d = byId(id), sh = d && shipBy(d.ship);
    function wrap(inner) { return '<div class="sq mob"><header class="sq-h"><div><b>' + esc(sh ? 'M/V ' + sh.name : 'Fleet') + '</b><div class="mute" style="font-size:12px">' + esc(L2(['Ricevimento a bordo', 'On-board receipt'])) + '</div></div><a class="btn sm" href="#/doc/' + id + '">' + esc(L2(['Ufficio', 'Office'])) + '</a></header>' + inner + '</div>'; }
    if (!d || d.type !== 'DN') return wrap('<div class="card"><div class="empty">QR ?</div></div>');
    if (d.status === 'ricevuta') return wrap('<section class="card stack" style="text-align:center;align-items:center;padding:32px"><div style="font-size:40px">✓</div><h2>' + esc(L2(['Ricevuta e caricata a magazzino', 'Received and loaded'])) + '</h2><div class="mute">' + esc(d.num + ' · ' + (d.signed || '')) + '</div><a class="btn" href="#/magazzino?nave=' + d.ship + '">' + esc(t('stores')) + '</a></section>');
    if (d.status === 'pronta') return wrap('<div class="card"><div class="empty">' + esc(L2(['Consegna non ancora spedita.', 'Delivery not shipped yet.'])) + '</div></div>');
    var po = d.from && byId(d.from[0]);
    var lines = (d.lines || []).map(function (l, i) {
      return '<div class="card stack" style="gap:8px;padding:12px"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:15px">' + esc(l.desc) + '</b><span class="j mute">' + l.row + '</span></div>' + (l.note ? '<div class="mute" style="font-size:12px">' + esc(l.note) + '</div>' : '') +
        '<div style="display:flex;align-items:center;gap:10px"><span class="mute" style="font-size:13px;flex:1">' + esc(L2(['Spediti', 'Shipped'])) + ' <b class="j">' + nf(l.qty) + '</b> ' + esc(l.uom) + '</span>' +
        '<button type="button" class="btn step" data-act="rcvstep" data-i="' + i + '" data-d="-1" aria-label="-">−</button><input name="q' + i + '" value="' + nf(l.qty) + '" inputmode="decimal" class="j" style="width:70px;text-align:center;font-size:18px"><button type="button" class="btn step" data-act="rcvstep" data-i="' + i + '" data-d="1" aria-label="+">+</button></div>' +
        locSelect(d.ship, i, locOf(d.ship, l.item)) + '</div>';
    }).join('');
    return wrap('<section class="card stack" style="gap:4px"><span class="j mute">' + esc(d.num) + (po ? ' · PO ' + esc(po.num) : '') + '</span><h1 class="h1" style="font-size:20px">' + esc(d.desc) + '</h1><span class="mute" style="font-size:13px">' + esc(supName(d.sup)) + '</span></section>' +
      '<form id="rcvform" data-id="' + d.id + '" class="stack" style="gap:10px">' + (lines || '<div class="card stack"><label>' + esc(L2(['Colli ricevuti', 'Packages received'])) + '<input name="pk" inputmode="numeric" value="1" style="font-size:18px"></label></div>') +
      '<section class="card stack"><label style="font-size:15px;color:var(--ink)">' + esc(L2(['Foto della DN timbrata e firmata', 'Photo of the stamped and signed DN'])) + '<input type="file" name="photo" accept="image/*" capture="environment" required></label>' +
      '<label style="flex-direction:row;gap:10px;align-items:center;color:var(--ink);font-size:15px"><input type="checkbox" name="signed" required style="width:22px;height:22px"> ' + esc(L2(['DN timbrata e firmata', 'DN stamped and signed'])) + '</label></section>' +
      '<button class="btn pri" type="submit" style="font-size:17px;padding:14px">' + esc(L2(['Conferma ricezione', 'Confirm receipt'])) + '</button>' +
      '<div class="mute" style="font-size:12px;text-align:center">' + esc(L2(['Nella versione ufficiale funziona anche senza rete: la conferma parte quando la nave torna connessa.', 'In the final version it also works offline.'])) + '</div></form>');
  }
  CLICK.rcvstep = function (a) { var f = document.getElementById('rcvform'); var el = f.elements['q' + a.getAttribute('data-i')]; el.value = nf(Math.max(0, parseNum(el.value) + (+a.getAttribute('data-d')))); };
  function submitReceive(f) {
    var dn = byId(f.getAttribute('data-id')); if (!dn) return; var po = dn.from && byId(dn.from[0]);
    uploadFiles(f.elements.photo.files, function (out) {
      DB.moves = DB.moves || [];
      (dn.lines || []).forEach(function (l, i) {
        var q = Math.max(0, parseNum(f.elements['q' + i].value)); l.recv = q;
        if (!l.item && q > 0) l.item = ensureItem(l, po);
        if (q > 0 && l.item) {
          var pl = po && po.lines ? po.lines.filter(function (x) { return x.row === l.src; })[0] : null;
          var lc = locRead(f, i); if (lc) { DB.loc = DB.loc || {}; DB.loc[dn.ship + '|' + l.item] = lc; }
          DB.moves.push({ id: 'M-' + dn.id + '-' + l.row + '-' + Date.now(), ship: dn.ship, item: l.item, date: TODAY, qty: q, kind: 'carico', doc: dn.id, row: l.row, loc: lc, cost: pl ? Math.round(unitEur(po, pl) * 10000) / 10000 : 0 });
        }
      });
      dn.attachments = dn.attachments || []; out.forEach(function (x) { dn.attachments.push({ id: 'A-' + x.key, name: L2(['DN firmata (foto da bordo)', 'Signed DN (photo from vessel)']), kind: L2(['Foto', 'Photo']), file: x }); });
      dn.signed = L2(['DN firmata', 'Signed DN']) + (out[0] ? ': ' + out[0].name : '') + ' · ' + fd(TODAY) + ' · QR';
      dn.side = 'office'; if (dn.track) dn.track.stage = 'a_bordo';
      setStatus(dn, 'ricevuta', L2(['Confermata a bordo con QR', 'Confirmed on board via QR']) + ((dn.lines || []).length ? ' · ' + dn.lines.length + ' ' + t('rows') : f.elements.pk ? ' · ' + f.elements.pk.value + ' ' + L2(['colli', 'packages']) : ''));
      save(); render(); window.scrollTo(0, 0);
    });
  }

  /* ---------- 7. spedizioni consolidate ---------- */
  function shipments() { return DB.shipments = DB.shipments || []; }
  function shpById(id) { return shipments().filter(function (s) { return s.id === id; })[0]; }
  function shpOf(dnId) { return shipments().filter(function (s) { return s.dns.indexOf(dnId) >= 0 && s.status !== 'chiusa'; })[0]; }
  function curT() { var r = route(); if (r.seg[0] === 'spedizione') return shpById(r.seg[1]); return curDoc(); }
  function dnValue(dn) {
    var po = dn.from && byId(dn.from[0]); if (!po || !po.lines) return 0;
    if (dn.lines && dn.lines.length) return dn.lines.reduce(function (a, l) { var pl = po.lines.filter(function (x) { return x.row === l.src; })[0]; return a + (pl ? unitEur(po, pl) * l.qty : 0); }, 0);
    return toEur(po.total || 0, po.cur);
  }
  function logAccount() { var a = DB.accounts.filter(function (x) { return x.post && /logistic/i.test(x.desc); })[0]; return a ? a.path : null; }
  CLICK.shpnew = function (a, r) {
    var nave = r.q.nave || 'PEP';
    var cand = docs(function (d) { return d.type === 'DN' && d.ship === nave && isOpen(d) && !d.stale && !shpOf(d.id); }).sort(function (x, y) { return stageIdx(stageOf(y)) - stageIdx(stageOf(x)); });
    var shipSel = '<select name="ship">' + DB.ships.filter(function (s) { return s.infoship; }).map(function (s) { return '<option value="' + s.code + '"' + (s.code === nave ? ' selected' : '') + '>' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('') + '</select>';
    formModal(L2(['Nuova spedizione consolidata', 'New consolidated shipment']),
      '<div class="filters"><label>' + esc(t('c_ship')) + shipSel + '</label><label>Hub<input name="hub" value="' + esc(((DB.settings || {}).forwarders || [])[0] ? (DB.settings.forwarders[0] + ' · Genova') : 'Hub · Genova') + '"></label><label>' + esc(L2(['Porto / agente', 'Port / agent'])) + '<input name="port"></label></div>' +
      '<div class="filters"><label>ETD<input type="date" name="etd" value="' + addDays(TODAY, 3) + '"></label><label>ETA ' + esc(L2(['a bordo', 'on board'])) + '<input type="date" name="eta" value="' + addDays(TODAY, 10) + '"></label></div>' +
      '<div class="stack" style="gap:4px"><span class="mute" style="font-size:13px">' + esc(L2(['Consegne da consolidare', 'Deliveries to consolidate'])) + ' (' + nave + ')</span>' +
      (cand.length ? cand.slice(0, 30).map(function (d) { var st = stageOf(d); return '<label style="flex-direction:row;gap:8px;color:var(--ink);font-size:13px"><input type="checkbox" name="dn" value="' + d.id + '"' + (/hub/.test(st) ? ' checked' : '') + '> <span class="j">' + esc(d.num) + '</span> ' + esc(d.desc) + ' <span class="mute">· ' + esc(supName(d.sup)) + ' · ' + esc(L2(STAGES[stageIdx(st)][1])) + '</span></label>'; }).join('') : '<div class="mute">' + esc(L2(['Nessuna consegna aperta per questa nave.', 'No open delivery for this vessel.'])) + '</div>') + '</div>',
      function (f) {
        var ids = [].map.call(f.querySelectorAll('input[name=dn]:checked'), function (c) { return c.value; });
        if (!ids.length) { toast(L2(['Scegli almeno una consegna', 'Pick at least one delivery'])); return false; }
        var sh = f.elements.ship.value, n = shipments().filter(function (s) { return s.ship === sh; }).length + 1;
        var s = { id: 'SHP-' + Date.now(), num: sh + '-' + TODAY.slice(0, 4) + '-SP-' + String(n).padStart(4, '0'), ship: sh, dns: ids, hub: f.elements.hub.value.trim(), port: f.elements.port.value.trim(), etd: f.elements.etd.value, due: f.elements.eta.value, status: 'aperta', track: { stage: 'in_hub', legs: [], events: [] }, costs: [], log: [{ at: TODAY, to: 'aperta', txt: L2(['Creata con ', 'Created with ']) + ids.length + ' DN' }] };
        shipments().push(s);
        ids.forEach(function (id) { var d = byId(id); d.log = d.log || []; d.log.push({ at: TODAY, to: d.status, txt: L2(['Consolidata nella spedizione ', 'Consolidated in shipment ']) + s.num }); });
        save(); location.hash = '#/spedizione/' + s.id;
      }, { w: 760, ok: L2(['Crea spedizione', 'Create shipment']), onInput: function (e, f) { if (e.target.name === 'ship') { f.closest('.modal-bg').remove(); location.hash = '#/logistica?nave=' + e.target.value; setTimeout(function () { CLICK.shpnew(null, route()); }, 50); } } });
  };
  function pageShipment(id) {
    var s = shpById(id); if (!s) return pageLogistics({});
    var dns = s.dns.map(byId).filter(Boolean), tot = dns.reduce(function (a, d) { return a + dnValue(d); }, 0);
    var cost = (s.costs || []).reduce(function (a, c) { return a + (c.amount || 0); }, 0);
    var rows = dns.map(function (d) {
      var v = dnValue(d), al = tot ? cost * v / tot : cost / dns.length, po = d.from && byId(d.from[0]);
      return '<tr class="r" data-href="#/doc/' + d.id + '"><td class="j">' + esc(d.num) + '</td><td>' + esc(d.desc) + '</td><td>' + esc(supName(d.sup)) + '</td><td class="j">' + esc(po ? po.num : '—') + '</td><td>' + chip(d) + '</td><td class="num j">' + nf(v) + '</td><td class="num j"><b>' + nf(al) + '</b></td></tr>';
    }).join('');
    var ci = function (k, l) { var c = (s.costs || []).filter(function (x) { return x.kind === k; })[0]; return '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(l) + '<input data-shpcost="' + k + '" value="' + (c ? nf(c.amount) : '') + '" inputmode="decimal" style="width:110px;text-align:right"></label>'; };
    var acc = logAccount();
    var body = '<div class="stack" style="gap:8px"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="j mute">' + esc(s.num) + '</span><span class="chip c-' + (s.status === 'consegnata' ? 'ok' : 'info') + '">' + esc(s.status === 'consegnata' ? L2(['Consegnata a bordo', 'Delivered on board']) : L2(['In corso', 'In progress'])) + '</span><span class="chip c-neutral">' + dns.length + ' DN</span></div>' +
      '<h1 class="h1">' + esc(L2(['Spedizione consolidata', 'Consolidated shipment'])) + ' → M/V ' + esc(shipBy(s.ship).name) + '</h1><div class="mute" style="font-size:13px">' + esc([s.hub, s.port].filter(Boolean).join(' → ')) + ' · ETD ' + fd(s.etd) + ' · ETA ' + fd(s.due) + '</div></div>' +
      logisticsCard(s) +
      '<section class="card stack"><h2>' + esc(L2(['Consegne nella spedizione', 'Deliveries in the shipment'])) + '</h2><div class="tablebox"><table class="grid"><thead><tr><th>DN</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(t('c_sup')) + '</th><th>PO</th><th>' + esc(t('c_status')) + '</th><th class="num">' + esc(L2(['Valore €', 'Value €'])) + '</th><th class="num">' + esc(L2(['Costi ripartiti €', 'Allocated costs €'])) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['Ogni DN si conferma a bordo da sola (QR o postazione Bordo): la spedizione porta i colli, la DN prova cosa è arrivato.', 'Each DN is confirmed on board on its own.'])) + '</div></section>' +
      '<section class="card stack"><h2>' + esc(L2(['Costi della spedizione', 'Shipment costs'])) + '</h2><div class="filters">' + ci('freight', L2(['Trasporto', 'Freight'])) + ci('hub', 'Hub / handling') + ci('customs', L2(['Dogana', 'Customs'])) + ci('agent', L2(['Agenzia / boat', 'Agency / boat'])) + '</div>' +
      '<div style="font-size:13px">' + esc(L2(['Totale ', 'Total '])) + '<b class="j">' + money(cost, 'EUR') + '</b>' + esc(L2([' ripartito sulle DN in proporzione al valore e messo a budget sul conto ', ' split on DNs by value and booked on account '])) + '<span class="j">' + esc(acc || '—') + '</span> (' + esc(L2(['ordinato finché non è a bordo, poi consegnato', 'ordered until on board, then delivered'])) + ').</div></section>' +
      '<section class="card stack"><h2>' + esc(t('history')) + '</h2><div class="log">' + (s.log || []).slice().reverse().map(function (e) { return '<div><span class="j">' + fd(e.at) + '</span><span>' + esc(e.txt) + '</span></div>'; }).join('') + '</div></section>';
    return shell('logistica', crumb([[t('fleet'), '#/'], [L2(['Logistica', 'Logistics']), '#/logistica?nave=' + s.ship]]), s.num, '<div class="stack" style="gap:14px;max-width:1100px">' + body + '</div>');
  }
  function shipmentBudget(ship, add) {
    var acc = logAccount(); if (!acc) return;
    shipments().forEach(function (s) { if (s.ship !== ship) return; var c = (s.costs || []).reduce(function (a, x) { return a + (x.amount || 0); }, 0); if (!c) return; if (s.status === 'consegnata') add(acc, 0, c); else add(acc, c, 0); });
  }

  /* ---------- 8. catalogo dalle tavole + suggerimenti ---------- */
  CLICK.tdparts = function (a) {
    var td = (DB.techdocs || []).filter(function (x) { return x.id === a.getAttribute('data-id'); })[0]; if (!td || !td.parts) return;
    var have = {}; (DB.items || []).forEach(function (i) { if (i.pn) have[i.pn] = 1; });
    var pfx = td.prefix || (td.refs || [])[0];
    formModal(L2(['Ricambi letti dalla tavola', 'Parts read from the plate']) + ' · ' + td.title,
      '<div class="mute" style="font-size:13px">' + esc(L2(['Elenco ricavato dalla tavola con riconoscimento del testo (OCR), da controllare prima di aggiungerlo. Nella versione ufficiale la lettura parte da sola al caricamento del PDF.', 'List read from the plate with OCR, to be checked.'])) + '</div>' +
      '<div class="tablebox" style="max-height:55vh;overflow:auto"><table class="grid"><thead><tr><th></th><th>Item</th><th>P/N</th><th>' + esc(t('c_desc')) + '</th><th>' + esc(L2(['Q.tà per motore/cil.', 'Qty per engine/cyl.'])) + '</th><th></th></tr></thead><tbody>' +
      td.parts.map(function (p, i) { var pn = pfx + '-' + p.no, h = have[pn]; return '<tr><td><input type="checkbox" name="pp" value="' + i + '"' + (h ? ' disabled' : ' checked') + '></td><td class="j">' + p.no + '</td><td class="j" style="white-space:nowrap">' + esc(pn) + '</td><td>' + esc(p.desc) + '</td><td class="j">' + esc(p.qty || '') + '</td><td>' + (h ? '<span class="chip c-ok">' + esc(L2(['a catalogo', 'in catalogue'])) + '</span>' : '<span class="chip c-info">' + esc(L2(['nuovo', 'new'])) + '</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>',
      function (f) {
        var n = 0; DB.items = DB.items || [];
        [].forEach.call(f.querySelectorAll('input[name=pp]:checked'), function (c) { var p = td.parts[+c.value], pn = pfx + '-' + p.no; DB.items.push({ id: 'M-' + pn, code: pn, impa: null, pn: pn, desc: p.desc.toUpperCase(), uom: 'PCE', maker: td.maker, model: td.model, equipment: td.equipment, ships: td.ships, note: 'Item ' + p.no + (p.qty ? ' · ' + p.qty : '') }); n++; });
        save(); render(); toast(n + ' ' + L2(['articoli aggiunti al catalogo', 'items added to catalogue']));
      }, { w: 860, ok: L2(['Aggiungi al catalogo', 'Add to catalogue']) });
  };
  var STOP = { AND: 1, FOR: 1, THE: 1, WITH: 1, PER: 1, CON: 1, DEL: 1, DELLA: 1, PCS: 1, PCE: 1, SET: 1, NEW: 1, SPARE: 1, PARTS: 1, REQ: 1 };
  function simItems(text) {
    var w = (text || '').toUpperCase().split(/[^A-Z0-9\-]+/).filter(function (x) { return x.length >= 3 && !STOP[x]; });
    if (!w.length) return [];
    return (DB.items || []).filter(function (it) { return !it.generic; }).map(function (it) { var tx = itemText(it), sc = 0; w.forEach(function (x) { if (tx.indexOf(x) >= 0) sc += x.length > 5 ? 2 : 1; }); return { it: it, sc: sc }; })
      .filter(function (x) { return x.sc >= 2 || (w.length === 1 && x.sc >= 1); }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 3);
  }
  function suggHtml(l, i) {
    var s = simItems(l.desc + ' ' + (l.note || '')); if (!s.length) return '';
    return '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:4px;font-size:12px"><span class="t-warn">' + esc(L2(['Senza codice. Forse è:', 'No code. Maybe:'])) + '</span>' + s.map(function (x) { return '<button type="button" class="btn sm" data-act="usesugg" data-i="' + i + '" data-id="' + x.it.id + '" style="font-size:11px">' + esc((x.it.impa || x.it.pn || '') + ' · ' + x.it.desc) + '</button>'; }).join('') + '</div>';
  }
  CLICK.usesugg = function (a) {
    var d = curDoc(); if (!d || !UI.edit || UI.edit.id !== d.id) return; var l = d.lines[+a.getAttribute('data-i')], it = itemById(a.getAttribute('data-id')); if (!l || !it) return;
    l.item = it.id; l.code = it.code; l.impa = it.impa || ''; l.desc = it.desc; l.note = [it.pn && it.pn !== it.impa ? 'P/N ' + it.pn : '', it.note].filter(Boolean).join(' · '); l.uom = it.uom || l.uom; if (it.equipment && !l.asset) l.asset = it.equipment;
    UI.edit.dirty = true; render(); toast(L2(['Riga collegata all\'articolo a catalogo', 'Row linked to catalogue item']));
  };


  /* =====================================================================
     SEMPLIFICAZIONE (20-10-2026): menu a 5 voci, schede di sezione,
     pagina documento con un solo pulsante e schede, "Da fare" in Acquisti
     ===================================================================== */
  var HIDDEN = { oggi: 1, menu: 1, score: 1, sped: 1, catalog: 1 };
  var SEC = {
    acq: { act: ['docs', 'doc', 'fornitori'], tabs: function (r) {
      var nave = r.q.nave || '', base = docs(function (d) { return (!nave || d.ship === nave) && isOpen(d); });
      var cur = r.seg[0] === 'fornitori' || r.seg[0] === 'fornitore' ? 'sup' : (r.q.tipo || 'RQ');
      var todo = todoCount(nave);
      return [['todo', L2(['Da fare', 'To do']), '#/docs' + qs({ tipo: 'todo', nave: nave }), todo]].concat(['RQ', 'RFQ', 'PO', 'DN'].map(function (ty) { return [ty, t(ty), '#/docs' + qs({ tipo: ty, nave: nave }), base.filter(function (d) { return d.type === ty; }).length]; }))
        .concat([['sup', t('suppliers'), '#/fornitori', null]]).map(function (x) { x.push(x[0] === cur); return x; });
    } },
    log: { act: ['logistica', 'magazzino', 'documenti'], tabs: function (r) {
      var nave = r.q.nave || '', a = r.seg[0];
      return [['arr', L2(['In arrivo', 'Incoming']), '#/logistica' + qs({ nave: nave }), null, a === 'logistica'], ['mag', t('stores'), '#/magazzino' + qs({ nave: nave || 'PEP' }), null, a === 'magazzino' || a === 'articolo'], ['doc', L2(['Documenti tecnici', 'Technical documents']), '#/documenti', null, a === 'documenti']];
    } },
    bud: { act: ['budget', 'contabilita', 'scadenze'], tabs: function (r) {
      var a = r.seg[0];
      return [['bud', t('budget'), '#/budget' + qs({ nave: r.q.nave || 'PEP' }), null, a === 'budget'], ['acc', L2(['Contabilità', 'Accounting']), '#/contabilita', null, a === 'contabilita']];
    } },
    set: { act: ['proposte', 'impostazioni', 'magazzini', 'dati'], tabs: function (r) {
      var a = r.seg[0];
      return [['gen', L2(['Generale', 'General']), '#/proposte', null, a === 'proposte'], ['tpl', L2(['Modelli documenti', 'Document templates']), '#/impostazioni', null, a === 'impostazioni'], ['wh', L2(['Magazzini', 'Warehouses']), '#/magazzini', null, a === 'magazzini'], ['dati', t('data'), '#/dati', null, a === 'dati']];
    } }
  };
  function secOf(active) { for (var k in SEC) if (SEC[k].act.indexOf(active) >= 0) return k; return null; }
  function secTabs(active) {
    var k = secOf(active), r = route(); if (!k || active === 'doc' || r.seg[0] === 'spedizione' || r.seg[0] === 'fornitore' || r.seg[0] === 'articolo') return '';
    return '<nav class="tabs sectabs">' + SEC[k].tabs(r).map(function (x) { return '<a class="' + (x[4] ? 'on' : '') + '" href="' + x[2] + '">' + esc(x[1]) + (x[3] != null ? '<span class="j">' + x[3] + '</span>' : '') + '</a>'; }).join('') + '</nav>';
  }
  function railHtml(active, ship) {
    var k = secOf(active);
    var E = [
      ['#/', 'fleet', t('fleet'), active === 'home' || active === 'ship'],
      ['#/docs' + qs({ tipo: P.seat === 'office' ? 'todo' : 'RQ', nave: ship }), 'cart', t('purchasing'), k === 'acq'],
      ['#/logistica' + qs({ nave: ship }), 'box', L2(['Logistica', 'Logistics']), k === 'log' || active === 'logistica'],
      ['#/' + (P.seat === 'acc' ? 'contabilita' : 'budget' + qs({ nave: ship || 'PEP' })), 'chart', t('budget'), k === 'bud']
    ];
    return '<nav class="rail" aria-label="' + esc(t('fleet')) + '"><div class="brand">' + esc(ship || 'FLEET') + '</div>' + E.map(function (e) { return railLink(e[0], e[1], e[2], e[3]); }).join('') +
      '<div class="sp"></div>' + railLink('#/proposte', 'gear', L2(['Impostazioni', 'Settings']), k === 'set') + '</nav>';
  }

  /* ---------- Da fare (dentro Acquisti) ---------- */
  var TODO = [
    ['dec', ['Da decidere', 'To decide'], ['eval', 'appr', 'send']],
    ['sol', ['Da sollecitare', 'To chase'], ['rfq', 'po', 'dn']],
    ['new', ['Richieste nuove da bordo', 'New requisitions from vessels'], ['new', 'inv']]
  ];
  function todoCount(nave) { return todayItems(nave).length; }
  function todoBody(q) {
    var nave = q.nave || '', items = todayItems(nave);
    var html = TODO.map(function (g) {
      var it = items.filter(function (x) { return g[2].indexOf(x.g) >= 0; }).sort(function (a, b) { return g[0] === 'dec' ? g[2].indexOf(a.g) - g[2].indexOf(b.g) || b.age - a.age : b.age - a.age; });
      var all = UI.qAll && UI.qAll[g[0]];
      return '<section class="card stack" style="gap:0"><h2 style="padding-bottom:8px">' + esc(L2(g[1])) + ' <span class="j mute">' + it.length + '</span></h2>' +
        (it.length ? it.slice(0, all ? 999 : 6).map(qRow).join('') : '<div class="mute" style="font-size:13px;padding:6px 0">' + esc(L2(['Niente da fare.', 'Nothing to do.'])) + '</div>') +
        (it.length > 6 && !all ? '<button class="btn ghost sm" data-act="qmore" data-k="' + g[0] + '" style="align-self:flex-start;margin-top:8px;color:var(--teal)">' + esc(L2(['Mostra tutte', 'Show all'])) + ' (' + it.length + ')</button>' : '') + '</section>';
    }).join('');
    var shipOpts = DB.ships.filter(function (s) { return s.infoship; }).map(function (s) { return '<option value="' + s.code + '"' + (nave === s.code ? ' selected' : '') + '>' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('');
    return '<div class="filters"><select data-filter="nave" aria-label="' + esc(t('c_ship')) + '"><option value="">' + esc(t('allShips')) + '</option>' + shipOpts + '</select><span style="flex:1"></span><button class="btn pri sm" data-act="newrq" data-ship="' + nave + '">' + esc(L2(['Nuova richiesta', 'New requisition'])) + '</button></div><div class="stack" style="gap:14px">' + html + '</div>';
  }

  /* ---------- Impostazioni · Generale ---------- */
  function pageGeneral() {
    var A = setts('approval', {}), Lc = setts('landed', {});
    var num = function (path, v, w) { return '<input class="j" data-aset="' + path + '" value="' + nf(v, v % 1 ? 1 : 0) + '" inputmode="decimal" style="width:' + (w || 90) + 'px;text-align:right">'; };
    var lab = function (l, inner) { return '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(l) + inner + '</label>'; };
    var tog = function (k, title, desc) { return '<label style="flex-direction:row;gap:10px;align-items:flex-start;color:var(--ink)"><input type="checkbox" data-act="flag" data-k="' + k + '"' + (feat(k) ? ' checked' : '') + ' style="margin-top:3px"> <span><b>' + esc(title) + '</b><br><span class="mute" style="font-size:12px">' + esc(desc) + '</span></span></label>'; };
    var stale = docs(function (d) { return staleDn(d) && !d.stale; }).length;
    var body = '<section class="card stack"><h2>' + esc(L2(['Visualizzazione', 'Display'])) + '</h2><div class="filters" style="align-items:flex-end">' +
      lab(t('fxLabel'), '<span class="fx j" style="align-self:flex-start">1 € = <input id="fxin" class="j" value="' + nf(fx(), 4) + '" style="width:72px"> $</span>') +
      lab(L2(['Lingua', 'Language']), '<button class="btn sm j" data-act="lang">' + (P.lang === 'en' ? 'English → Italiano' : 'Italiano → English') + '</button>') +
      lab(L2(['Tema', 'Theme']), '<button class="btn sm" data-act="theme">' + ico(effTheme() === 'dark' ? 'sun' : 'moon') + ' ' + esc(effTheme() === 'dark' ? L2(['Passa al chiaro', 'Switch to light']) : L2(['Passa allo scuro', 'Switch to dark'])) + '</button>') + '</div></section>' +
      '<section class="card stack"><h2>' + esc(L2(['Funzioni', 'Features'])) + '</h2>' +
      tog('approv', L2(['Approvazione automatica sotto soglia', 'Automatic approval below threshold']), L2(['Gli ordini dentro soglia e budget si approvano da soli.', 'Orders within threshold and budget approve themselves.'])) +
      '<div class="filters" style="padding-left:28px">' + lab(L2(['Soglia automatica €', 'Auto threshold €']), num('approval.auto', A.auto)) + lab(L2(['Approvatore', 'Approver']), '<input data-asett="approval.mgr" value="' + esc(A.mgr || '') + '" style="width:170px">') + lab(L2(['fino a €', 'up to €']), num('approval.mgrMax', A.mgrMax)) + lab(L2(['oltre o fuori budget', 'above or off budget']), '<input data-asett="approval.top" value="' + esc(A.top || '') + '" style="width:150px">') + '</div>' +
      tog('landed', L2(['Costo stimato a bordo in comparazione', 'Landed cost estimate in comparison']), L2(['Un totale per fornitore: trasporto per zona, hub, dogana extra-UE.', 'One total per supplier.'])) +
      '<div class="filters" style="padding-left:28px">' + ['EU', 'EXTRA', 'ASIA'].map(function (z) { return lab(L2(['Trasporto ', 'Freight ']) + z + ' %', num('landed.' + z + '.pct', (Lc[z] || {}).pct, 60)); }).join('') + lab('Hub €', num('landed.hub', Lc.hub, 70)) + lab(L2(['Dogana %', 'Customs %']), num('landed.customs', Lc.customs, 60)) + '</div>' +
      tog('link', L2(['Link offerta per il fornitore', 'Supplier quotation link']), L2(['Il fornitore compila l\'offerta online.', 'The supplier fills in the offer online.'])) +
      tog('qr', L2(['Ricevimento a bordo con QR', 'On-board receipt with QR']), L2(['Etichetta con QR sulla consegna, conferma dal telefono.', 'QR label, confirmation from the phone.'])) + '</section>' +
      (stale ? '<section class="card stack"><h2>' + esc(L2(['Pulizia dati', 'Data clean-up'])) + '</h2><div style="font-size:13px">' + stale + ' ' + esc(L2(['consegne importate con arrivo previsto da oltre 30 giorni e mai confermate. Archiviarle le toglie da Da fare e dai ritardi.', 'imported deliveries due over 30 days ago, never confirmed.'])) + '</div><button class="btn sm" style="align-self:flex-start" data-act="stalearchive" data-nave="">' + esc(L2(['Archivia come storiche', 'Archive as historical'])) + '</button></section>' : '');
    return shell('proposte', crumb([[t('fleet'), '#/']]), L2(['Impostazioni', 'Settings']), body);
  }

  /* ---------- pagina documento: menu Altro e schede ---------- */
  CLICK.more = function () { UI.more = !UI.more; render(); };
  CLICK.dtab = function (a) { var d = curDoc(); UI.dtab = UI.dtab || {}; UI.dtab[d.id] = a.getAttribute('data-k'); render(); };
  function moreMenu(d) {
    var it = [], secActs = UI.edit && UI.edit.id === d.id ? [] : actionsFor(d).filter(function (a) { return a.sec; });
    if ((d.type === 'RFQ' || d.type === 'PO') && d.lines && d.lines.length) it.push('<button data-act="pdf">' + esc(L2(['Anteprima PDF', 'PDF preview'])) + '</button>');
    if (feat('link') && d.type === 'RFQ' && d.lines && d.lines.length && { creata: 1, inviata: 1, quotata: 1 }[d.status]) it.push('<button data-act="suplink">' + esc(L2(['Link offerta per il fornitore', 'Supplier quotation link'])) + '</button>');
    if (feat('qr') && d.type === 'DN') it.push('<button data-act="qrprint">' + esc(L2(['Stampa etichetta QR', 'Print QR label'])) + '</button>');
    if (!(UI.edit && UI.edit.id === d.id)) it.push('<button data-act="editstart">' + esc(L2(['Modifica', 'Edit'])) + '</button>');
    secActs.forEach(function (a) { it.push('<button data-act="adv" data-to="' + a.to + '" data-form="' + (a.form || '') + '">' + esc(a.l[P.lang === 'en' ? 1 : 0]) + '</button>'); });
    if (CANCEL[d.type] && isOpen(d)) it.push('<button data-act="cancel" class="t-bad">' + esc(t('cancel')) + '</button>');
    if (!it.length) return '';
    return '<div class="colmenu"><button class="btn sm" data-act="more" aria-expanded="' + !!UI.more + '">' + esc(L2(['Altro', 'More'])) + ' ▾</button>' + (UI.more ? '<div class="menu moremenu" role="menu">' + it.join('') + '</div>' : '') + '</div>';
  }
  function docTabs(d, parts) {
    UI.dtab = UI.dtab || {};
    var keys = Object.keys(parts).filter(function (k) { return parts[k] != null; });
    var cur = UI.edit && UI.edit.id === d.id ? 'righe' : UI.dtab[d.id] || (d.type === 'DN' && parts.sped ? 'sped' : 'righe');
    if (keys.indexOf(cur) < 0) cur = keys[0];
    var lab = { righe: L2(['Righe', 'Lines']), all: L2(['Allegati', 'Attachments']) + ' <span class="j">' + (d.attachments || []).length + '</span>', sped: L2(['Spedizione', 'Shipment']), cron: L2(['Cronologia', 'History']) };
    return '<nav class="tabs doctabs">' + keys.map(function (k) { return '<a href="#" onclick="return false" data-act="dtab" data-k="' + k + '" class="' + (k === cur ? 'on' : '') + '">' + lab[k] + '</a>'; }).join('') + '</nav>' + parts[cur];
  }


  /* ---------- magazzini e ubicazioni per nave (anagrafica come InfoSHIP) ---------- */
  function whOf(ship) { DB.warehouses = DB.warehouses || {}; return DB.warehouses[ship]; }
  function placementsOf(ship) { var w = whOf(ship); return w ? w.placements.filter(function (p) { return !p.cancelled; }) : []; }
  function defPlacement(ship) { var p = placementsOf(ship); return (p.filter(function (x) { return x.default; })[0] || p[0] || {}).code || ''; }
  function locParts(v) { v = v || ''; var i = v.indexOf(' · '); return i < 0 ? [v, ''] : [v.slice(0, i), v.slice(i + 3)]; }
  function locSelect(ship, i, cur) {
    var pl = placementsOf(ship), lp = locParts(cur), sel = pl.some(function (p) { return p.code === lp[0]; }) ? lp[0] : defPlacement(ship), det = pl.some(function (p) { return p.code === lp[0]; }) ? lp[1] : cur || '';
    if (!pl.length) return '<input name="loc' + i + '" value="' + esc(cur || '') + '" placeholder="' + esc(L2(['es. Magazzino macchina A3', 'e.g. Engine store A3'])) + '" style="width:170px">';
    return '<span style="display:inline-flex;gap:6px;flex-wrap:wrap"><select name="pl' + i + '" aria-label="' + esc(L2(['Ubicazione', 'Placement'])) + '">' + pl.map(function (p) { return '<option value="' + esc(p.code) + '"' + (p.code === sel ? ' selected' : '') + '>' + esc(p.code) + '</option>'; }).join('') + '</select>' +
      '<input name="loc' + i + '" value="' + esc(det) + '" placeholder="' + esc(L2(['scaffale / posizione', 'shelf / position'])) + '" style="width:130px"></span>';
  }
  function locRead(f, i) { var pl = f.elements['pl' + i], d = (f.elements['loc' + i] ? f.elements['loc' + i].value : '').trim(); return pl ? pl.value + (d ? ' · ' + d : '') : d; }
  function pageWarehouses(q) {
    var ships = DB.ships, ship = q.nave || 'MDT', w = whOf(ship);
    var pick = '<div class="shippick">' + ships.map(function (s) { return '<a class="' + (s.code === ship ? 'on' : '') + '" href="#/magazzini?nave=' + s.code + '">' + s.code + '</a>'; }).join('') + '</div>';
    if (!w) return shell('magazzini', crumb([[t('fleet'), '#/']]), L2(['Magazzini', 'Warehouses']), pick + '<div class="card stack"><div class="empty">' + esc(L2(['Nessun magazzino per questa nave.', 'No warehouse for this vessel.'])) + '</div><button class="btn pri" style="align-self:flex-start" data-act="whcopy" data-from="MDT" data-to="' + ship + '">' + esc(L2(['Crea copiando la struttura di MED TOSCANA', 'Create copying MED TOSCANA structure'])) + '</button></div>');
    var f = function (k, v, wd) { return '<input data-whf="' + ship + '|' + k + '" value="' + esc(v || '') + '" style="width:' + (wd || 220) + 'px">'; };
    var lab = function (l, h) { return '<label class="stack" style="gap:3px;font-size:12px;color:var(--mute)">' + esc(l) + h + '</label>'; };
    var used = {}; Object.keys(DB.loc || {}).forEach(function (k) { if (k.indexOf(ship + '|') === 0) { var c = locParts(DB.loc[k])[0]; used[c] = (used[c] || 0) + 1; } });
    var rows = w.placements.map(function (p, i) {
      var pf = function (k, wd) { return '<input data-plf="' + ship + '|' + i + '|' + k + '" value="' + esc(p[k] || '') + '" style="width:' + wd + 'px">'; };
      return '<tr' + (p.cancelled ? ' style="opacity:.5"' : '') + '><td>' + pf('code', 150) + '</td><td>' + pf('desc', 260) + '</td><td>' + pf('layout', 150) + '</td>' +
        '<td style="text-align:center"><input type="radio" name="pldef" data-pldef="' + ship + '|' + i + '"' + (p.default ? ' checked' : '') + ' aria-label="Default"></td>' +
        '<td style="text-align:center"><input type="checkbox" data-plcan="' + ship + '|' + i + '"' + (p.cancelled ? ' checked' : '') + ' aria-label="' + esc(L2(['Annullata', 'Cancelled'])) + '"></td><td class="num j">' + (used[p.code] || '') + '</td></tr>';
    }).join('');
    var others = ships.filter(function (s) { return s.code !== ship && whOf(s.code); }).map(function (s) { return '<option value="' + s.code + '">' + s.code + ' · ' + esc(s.name) + '</option>'; }).join('');
    var body = pick + '<section class="card stack"><h2>' + esc(L2(['Magazzino', 'Warehouse'])) + '</h2><div class="filters" style="align-items:flex-end">' +
      lab(L2(['Codice', 'Code']), f('code', w.code, 150)) + lab(L2(['Descrizione', 'Description']), f('desc', w.desc, 280)) +
      lab(L2(['Gestito da', 'Edit side']), '<select data-whf="' + ship + '|side"><option value="Remote"' + (w.side === 'Remote' ? ' selected' : '') + '>Remote (' + esc(L2(['bordo', 'vessel'])) + ')</option><option value="Local"' + (w.side === 'Local' ? ' selected' : '') + '>Local (' + esc(L2(['ufficio', 'office'])) + ')</option></select>') +
      '<label class="tog"><input type="checkbox" data-whc="' + ship + '|central"' + (w.central ? ' checked' : '') + '> ' + esc(L2(['Magazzino centrale', 'Central warehouse'])) + '</label></div></section>' +
      '<section class="card stack"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><h2>' + esc(L2(['Ubicazioni', 'Placements'])) + '</h2><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="pladd" data-ship="' + ship + '">' + esc(L2(['Aggiungi ubicazione', 'Add placement'])) + '</button>' +
      (others ? '<select id="whfrom" aria-label="from">' + others + '</select><button class="btn sm" data-act="whcopy" data-to="' + ship + '">' + esc(L2(['Copia struttura da', 'Copy structure from'])) + '</button>' : '') + '</span></div>' +
      '<div class="tablebox"><table class="grid edit"><thead><tr><th>' + esc(L2(['Ubicazione', 'Placement'])) + '</th><th>' + esc(L2(['Descrizione', 'Description'])) + '</th><th>Layout</th><th>Default</th><th>' + esc(L2(['Annullata', 'Cancelled'])) + '</th><th class="num">' + esc(L2(['Articoli', 'Items'])) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['Struttura presa da InfoSHIP (MED TOSCANA) e replicata sulle altre navi; i codici restano quelli di InfoSHIP per l\'import. Al ricevimento a bordo si sceglie l\'ubicazione e, se serve, lo scaffale.', 'Structure from InfoSHIP (MED TOSCANA), replicated on the other vessels.'])) + '</div></section>';
    return shell('magazzini', crumb([[t('fleet'), '#/']]), L2(['Magazzini', 'Warehouses']) + ' · ' + shipBy(ship).name, body);
  }
  CLICK.pladd = function (a) { var w = whOf(a.getAttribute('data-ship')); w.placements.push({ code: 'NUOVA', desc: '', layout: '', default: false }); save(); render(); };
  CLICK.whcopy = function (a) {
    var to = a.getAttribute('data-to'), from = a.getAttribute('data-from') || (document.getElementById('whfrom') || {}).value, src = whOf(from); if (!src) return;
    var nm = shipBy(to).name.replace(/\b\w+/g, function (x) { return x.charAt(0) + x.slice(1).toLowerCase(); }), fnm = shipBy(from).name.replace(/\b\w+/g, function (x) { return x.charAt(0) + x.slice(1).toLowerCase(); });
    var rp = function (v) { return String(v || '').split(from).join(to).split(fnm).join(nm); };
    DB.warehouses[to] = { code: rp(src.code), desc: rp(src.desc), central: src.central, side: src.side, placements: src.placements.map(function (p) { return { code: rp(p.code), desc: rp(p.desc), layout: rp(p.layout), default: p.default, cancelled: p.cancelled }; }) };
    save(); render(); toast(L2(['Struttura copiata da ', 'Structure copied from ']) + from);
  };
  function invFor(ship, T) {
    var s = ((DB.settings || {}).invoiceToShip || {})[ship] || {};
    return s.name || s.address ? s : T.invoiceTo;
  }
  function invoiceSection(T) {
    var inp = function (path, v, w) { return '<input data-asett="' + path + '" value="' + esc(v || '') + '" style="width:' + w + 'px">'; };
    var per = (DB.settings || {}).invoiceToShip || {};
    var rows = DB.ships.map(function (s) { var x = per[s.code] || {}; return '<tr><td><span class="code j">' + s.code + '</span></td><td>' + inp('invoiceToShip.' + s.code + '.name', x.name, 220) + '</td><td>' + inp('invoiceToShip.' + s.code + '.address', x.address, 260) + '</td><td>' + inp('invoiceToShip.' + s.code + '.vat', x.vat, 130) + '</td><td>' + inp('invoiceToShip.' + s.code + '.email', x.email, 190) + '</td></tr>'; }).join('');
    return '<section class="card stack"><h2>' + esc(L2(['Fatturare a (ordini) · per nave', 'Invoice to (orders) · per vessel'])) + '</h2>' +
      '<div class="mute" style="font-size:12px">' + esc(L2(['Ogni nave fattura al suo armatore. Se una riga è vuota l\'ordine usa i dati predefiniti.', 'Each vessel invoices its owner. Empty row = default.'])) + '</div>' +
      '<div class="tablebox"><table class="grid edit"><thead><tr><th>' + esc(t('c_ship')) + '</th><th>' + esc(L2(['Società / armatore', 'Company / owner'])) + '</th><th>' + esc(L2(['Indirizzo di fatturazione', 'Invoice address'])) + '</th><th>' + esc(L2(['P. IVA / VAT', 'VAT no.'])) + '</th><th>' + esc(L2(['Email fatture', 'Invoice email'])) + '</th></tr></thead><tbody>' + rows +
      '<tr><td class="mute" style="font-size:12px">' + esc(L2(['Predefinito', 'Default'])) + '</td><td>' + inp('invoiceTo.name', T.invoiceTo.name, 220) + '</td><td>' + inp('invoiceTo.address', T.invoiceTo.address, 260) + '</td><td>' + inp('invoiceTo.vat', T.invoiceTo.vat, 130) + '</td><td>' + inp('invoiceTo.email', T.invoiceTo.email, 190) + '</td></tr></tbody></table></div></section>';
  }


  /* ---------- comparazione: quadro generale in alto, più veloce, più vicino alla nave ---------- */
  var PORTS = [
    ['Genova', 44.41, 8.93, 'genova|genoa'], ['La Spezia', 44.10, 9.83, 'spezia'], ['Livorno', 43.55, 10.30, 'livorno|leghorn'], ['Napoli', 40.84, 14.26, 'napoli|naples'], ['Salerno', 40.67, 14.75, 'salerno'],
    ['Civitavecchia', 42.09, 11.79, 'civitavecchia'], ['Gioia Tauro', 38.44, 15.90, 'gioia tauro'], ['Taranto', 40.47, 17.21, 'taranto'], ['Bari', 41.13, 16.87, 'bari'], ['Ancona', 43.62, 13.51, 'ancona'],
    ['Ravenna', 44.42, 12.20, 'ravenna'], ['Venezia', 45.44, 12.33, 'venezia|venice|marghera'], ['Trieste', 45.65, 13.77, 'trieste'], ['Palermo', 38.12, 13.36, 'palermo'], ['Catania', 37.50, 15.09, 'catania'],
    ['Augusta', 37.23, 15.22, 'augusta'], ['Cagliari', 39.21, 9.11, 'cagliari'], ['Milano', 45.46, 9.19, 'milano|milan'], ['Bologna', 44.49, 11.34, 'bologna'], ['Torino', 45.07, 7.69, 'torino|turin'],
    ['Malta', 35.82, 14.53, 'malta|valletta|marsaxlokk'], ['Marsiglia', 43.30, 5.37, 'marseille|marsiglia|fos'], ['Barcellona', 41.35, 2.17, 'barcelona|barcellona'], ['Valencia', 39.44, -0.32, 'valencia'], ['Algeciras', 36.13, -5.44, 'algeciras|gibraltar'],
    ['Pireo', 37.94, 23.64, 'piraeus|pireo|athens|atene'], ['Istanbul', 41.01, 28.98, 'istanbul'], ['Rotterdam', 51.95, 4.14, 'rotterdam'], ['Anversa', 51.26, 4.40, 'antwerp|anversa'], ['Amburgo', 53.55, 9.97, 'hamburg|amburgo'],
    ['Brema', 53.08, 8.80, 'bremen|brema|bremerhaven'], ['Copenaghen', 55.68, 12.57, 'copenhagen|copenaghen'], ['Danzica', 54.35, 18.65, 'gdansk|danzica'], ['Le Havre', 49.49, 0.11, 'le havre'], ['Southampton', 50.90, -1.40, 'southampton'],
    ['Pusan', 35.10, 129.04, 'busan|pusan|korea|corea'], ['Shanghai', 31.23, 121.47, 'shanghai|china|cina'], ['Singapore', 1.26, 103.84, 'singapore'], ['Hong Kong', 22.30, 114.17, 'hong kong'], ['Tokyo', 35.65, 139.77, 'tokyo|yokohama|japan|giappone'],
    ['Dubai', 25.27, 55.30, 'dubai|jebel ali|uae'], ['Mumbai', 18.95, 72.84, 'mumbai|india'], ['Houston', 29.73, -95.27, 'houston|usa'], ['Port Said', 31.26, 32.30, 'port said|suez'], ['Algeri', 36.77, 3.06, 'algiers|algeri']
  ];
  function findPort(txt) { txt = (txt || '').toLowerCase(); if (!txt) return null; var best = null, bi = -1; PORTS.forEach(function (p) { var re = new RegExp('\\b(' + p[3] + ')', 'g'), m; while ((m = re.exec(txt))) { if (m.index > bi) { bi = m.index; best = p; } } }); return best; }
  function km(a, b) { var R = 6371, r = Math.PI / 180, dLa = (b[1] - a[1]) * r, dLo = (b[2] - a[2]) * r, h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2); return Math.round(2 * R * Math.asin(Math.sqrt(h))); }
  function shipPort(ship) { var s = shipBy(ship); return s && s.nextPort ? findPort(s.nextPort.name) : null; }
  function lineDist(r, x) { var sp = shipPort(r.ship); if (!sp) return null; var p = findPort(x.origin) || findPort((r.offer || {}).place); return p ? km(p, sp) : null; }
  function offerSummary(r) {
    var q = r.lines.filter(function (x) { return x.quoted; }), lts = q.map(function (x) { return x.days; }).filter(function (v) { return v != null; });
    var conds = {}; q.forEach(function (x) { if (x.cond) conds[x.cond] = (conds[x.cond] || 0) + 1; });
    var origs = []; q.forEach(function (x) { var o = (x.origin || '').trim(); if (o && origs.indexOf(o) < 0) origs.push(o); });
    var ds = q.map(function (x) { return lineDist(r, x); }).filter(function (v) { return v != null; });
    return { cov: q.length, lt0: lts.length ? Math.min.apply(null, lts) : null, lt1: lts.length ? Math.max.apply(null, lts) : null, conds: conds, origs: origs, dist: ds.length ? Math.max.apply(null, ds) : null };
  }
  function cmpHead(r, best) {
    var top = '<a href="#/doc/' + r.id + '" style="font-weight:700;color:var(--ink);text-decoration:none">' + esc(supName(r.sup)) + '</a><span class="j mute" style="font-size:11px">' + esc(r.num) + ' · ' + esc(r.cur) + '</span>' +
      '<span style="display:flex;gap:4px;flex-wrap:wrap">' + chip(r) + (r.offer && r.offer.via === 'link' ? '<span class="chip c-info" style="font-size:10px">via link</span>' : '') + '</span>';
    if (r.status !== 'quotata') return '<div class="cmp-head">' + top + '</div>';
    var s = offerSummary(r), o = r.offer || {}, eur = toEur(r.total, r.cur);
    var tags = (best.price === r.id ? '<span class="tag t-price">' + esc(L2(['miglior prezzo', 'best price'])) + '</span>' : '') + (best.fast === r.id ? '<span class="tag t-fast">' + esc(L2(['più veloce', 'fastest'])) + '</span>' : '') + (best.near === r.id ? '<span class="tag t-near">' + esc(L2(['più vicino alla nave', 'closest to vessel'])) + '</span>' : '');
    var row = function (l, v) { return '<span class="kvr"><span>' + esc(l) + '</span><b>' + v + '</b></span>'; };
    return '<div class="cmp-head">' + top +
      '<span class="j" style="font-size:17px;font-weight:700;margin-top:2px">' + money(r.total, r.cur) + '</span><span class="j mute" style="font-size:11px">≈ ' + (r.cur === 'USD' ? money(eur, 'EUR') : money(toUsd(r.total, 'EUR'), 'USD')) + ' · ' + esc(L2(['copertura', 'coverage'])) + ' ' + s.cov + '/' + r.lines.length + ((r.charges || []).some(function (c) { return c.amount; }) ? ' · ' + esc(L2(['spese incl.', 'charges incl.'])) : '') + '</span>' +
      (tags ? '<span style="display:flex;gap:4px;flex-wrap:wrap">' + tags + '</span>' : '') +
      '<span class="kvbox">' + row('Incoterm', esc(o.incoterm || '—')) + row(L2(['Luogo di resa', 'Place']), esc(o.place || '—')) +
      row(L2(['Lead time', 'Lead time']), s.lt0 == null ? '—' : s.lt0 === s.lt1 ? s.lt0 + ' gg' : s.lt0 + '–' + s.lt1 + ' gg') +
      row(L2(['Condizione', 'Condition']), Object.keys(s.conds).map(function (c) { return esc(c === 'Usato' ? L2(['Usato', 'Used']) : c) + (Object.keys(s.conds).length > 1 ? ' ' + s.conds[c] : ''); }).join(' · ') || '—') +
      row(L2(['Origine / stock', 'Origin / stock']), esc(s.origs.slice(0, 2).join(', ') + (s.origs.length > 2 ? ' +' + (s.origs.length - 2) : '') || '—')) +
      (s.dist != null ? row(L2(['Dalla nave', 'From vessel']), '≈ ' + nf(s.dist, 0) + ' km') : '') +
      (o.validTo ? row(L2(['Valida fino al', 'Valid until']), fd(o.validTo)) : '') + '</span>' +
      (feat('landed') ? landedFoot(r) : '') +
      '<button type="button" class="btn sm" data-act="awardall" data-rfq="' + r.id + '" style="margin-top:4px">' + esc(L2(['Scegli tutta l\'offerta', 'Pick whole offer'])) + '</button></div>';
  }
  function cmpBest(rq, quoted) {
    var b = {}, bp = null, bf = null, bn = null;
    quoted.forEach(function (r) {
      var s = offerSummary(r), e = toEur(r.total, r.cur) * (r.lines.length / Math.max(1, s.cov));
      if (bp == null || e < bp) { bp = e; b.price = r.id; }
      if (s.lt1 != null && (bf == null || s.lt1 < bf)) { bf = s.lt1; b.fast = r.id; }
      if (s.dist != null && (bn == null || s.dist < bn)) { bn = s.dist; b.near = r.id; }
    });
    return b;
  }
  function portInput(rq) {
    var s = shipBy(rq.ship), np = s.nextPort || {}, p = findPort(np.name);
    return '<label class="tog" style="gap:6px">' + esc(L2(['Prossimo porto ', 'Next port '])) + esc(s.code) + ' <input list="portlist" data-nextport="' + s.code + '" value="' + esc(np.name || '') + '" placeholder="' + esc(L2(['es. Ravenna', 'e.g. Ravenna'])) + '" style="width:120px;border:0;background:transparent"><input type="date" data-nexteta="' + s.code + '" value="' + esc(np.eta || '') + '" style="border:0;background:transparent" aria-label="ETA">' +
      (np.name && !p ? '<span class="t-warn" style="font-size:11px">' + esc(L2(['porto non riconosciuto', 'port not recognised'])) + '</span>' : '') + '</label><datalist id="portlist">' + PORTS.map(function (x) { return '<option value="' + x[0] + '">'; }).join('') + '</datalist>';
  }

  /* ---------- render & events ---------- */
  function render() {
    var r = route(), s = r.seg, html;
    if (s[0] === 'offerta' || s[0] === 'ricevi') { root.innerHTML = s[0] === 'offerta' ? pageSupplierQuote(s[1]) : pageReceive(s[1]); document.documentElement.lang = P.lang; afterRender(); return; }
    if (!s.length) html = feat('oggi') ? pageToday(r.q) : pageHome();
    else if (s[0] === 'flotta') html = pageHome();
    else if (s[0] === 'proposte') html = pageGeneral();
    else if (s[0] === 'magazzini') html = pageWarehouses(r.q);
    else if (s[0] === 'spedizione') html = pageShipment(s[1]);
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
    else if (s[0] === 'documenti') html = pageLibrary(r.q);
    else if (s[0] === 'logistica') html = pageLogistics(r.q);
    else html = pageHome();
    var active = document.activeElement, keepFilter = active && active.getAttribute && active.getAttribute('data-filter') === 'q' ? active.selectionStart : null;
    root.innerHTML = html;
    afterRender();
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
    if (UI.more && !(a && a.getAttribute('data-act') === 'more')) { UI.more = false; render(); if (!a) return; }
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
  root.addEventListener('submit', function (e) {
    if (e.target.id === 'sqform') { e.preventDefault(); submitSupplierQuote(e.target); }
    else if (e.target.id === 'rcvform') { e.preventDefault(); submitReceive(e.target); }
  });
  root.addEventListener('change', function (e) {
    var el = e.target;
    if (el.getAttribute('data-whf') || el.getAttribute('data-whc')) { var wp = (el.getAttribute('data-whf') || el.getAttribute('data-whc')).split('|'), ww = whOf(wp[0]); if (ww) { ww[wp[1]] = el.type === 'checkbox' ? el.checked : el.value.trim(); save(); toast(L2(['Salvato', 'Saved'])); } return; }
    if (el.getAttribute('data-plf')) { var pp = el.getAttribute('data-plf').split('|'), pw = whOf(pp[0]); if (pw) { pw.placements[+pp[1]][pp[2]] = el.value.trim(); save(); toast(L2(['Salvato', 'Saved'])); } return; }
    if (el.getAttribute('data-pldef')) { var pd = el.getAttribute('data-pldef').split('|'), dw = whOf(pd[0]); dw.placements.forEach(function (x, k) { x.default = k === +pd[1]; }); save(); render(); return; }
    if (el.getAttribute('data-plcan')) { var pc2 = el.getAttribute('data-plcan').split('|'), cw = whOf(pc2[0]); cw.placements[+pc2[1]].cancelled = el.checked; save(); render(); return; }
    if (el.getAttribute('data-nextport') || el.getAttribute('data-nexteta')) { var nsh = shipBy(el.getAttribute('data-nextport') || el.getAttribute('data-nexteta')); nsh.nextPort = nsh.nextPort || {}; if (el.getAttribute('data-nextport')) nsh.nextPort.name = el.value.trim(); else nsh.nextPort.eta = el.value; save(); render(); toast(L2(['Prossimo porto aggiornato', 'Next port updated'])); return; }
    if (el.getAttribute('data-aset')) { aset(el.getAttribute('data-aset'), parseNum(el.value)); toast(L2(['Parametro salvato', 'Parameter saved'])); return; }
    if (el.getAttribute('data-asett')) { aset(el.getAttribute('data-asett'), el.value.trim()); toast(L2(['Parametro salvato', 'Parameter saved'])); return; }
    if (el.getAttribute('data-shpcost')) { var sp = shpById(route().seg[1]); if (sp) { var kk = el.getAttribute('data-shpcost'), am = parseNum(el.value); sp.costs = (sp.costs || []).filter(function (c) { return c.kind !== kk; }); if (am) sp.costs.push({ kind: kk, amount: am }); sp.log.push({ at: TODAY, to: sp.status, txt: L2(['Costo ', 'Cost ']) + kk + ' ' + nf(am) + ' €' }); save(); render(); } return; }
    if (el.getAttribute('data-act') === 'col') {
      var tipo = route().q.tipo || 'RQ', cols = (P.cols[tipo] || TYPECOLS[tipo].def).slice(), k = el.getAttribute('data-k');
      if (el.checked && cols.indexOf(k) < 0) { var order = TYPECOLS[tipo].all; cols.push(k); cols.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); }); }
      if (!el.checked) cols = cols.filter(function (c) { return c !== k; });
      if (!cols.length) cols = ['num'];
      P.cols[tipo] = cols; savePrefs(); render(); return;
    }
    if (el.getAttribute('data-act') === 'zero') { UI.showZero = el.checked; render(); return; }
    if (el.getAttribute('data-edit')) { editLine(el); return; }
    if (el.getAttribute('data-hoffer') || el.getAttribute('data-hch')) { var dof = curDoc(); if (dof && UI.edit && UI.edit.id === dof.id) { if (el.getAttribute('data-hoffer')) { dof.offer = dof.offer || {}; dof.offer[el.getAttribute('data-hoffer')] = el.value.trim(); } else { var kk = el.getAttribute('data-hch'), amt = parseNum(el.value); dof.charges = (dof.charges || []).filter(function (c) { return c.kind !== kk; }); if (amt) dof.charges.push({ kind: kk, amount: amt }); dof.total = docTotal(dof); } UI.edit.dirty = true; } return; }
    if (el.getAttribute('data-act') === 'attach') { var da = curDoc(); if (!da) return; uploadFiles(el.files, function (out) { da.attachments = da.attachments || []; out.forEach(function (fl) { da.attachments.push({ id: 'A-' + fl.key, name: fl.name, kind: guessKind(fl.name), file: fl }); }); if (UI.edit && UI.edit.id === da.id) UI.edit.dirty = true; else { da.log = da.log || []; da.log.push({ at: TODAY, to: da.status, txt: L2(['Allegati aggiunti: ', 'Attachments added: ']) + out.map(function (x) { return x.name; }).join(', ') }); save(); } render(); toast(out.length + ' ' + L2(['file allegati', 'files attached'])); }); return; }
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

  DB.docs.forEach(function (d) { if (!d.log) d.log = []; if (d.num && d.num.indexOf('/') >= 0) d.num = d.num.replace(/\//g, '-'); });
  (DB.shipments || []).forEach(function (x) { x.num = x.num.replace(/\//g, '-'); });
  if (window.SEED.settings && window.SEED.settings.invoiceToShip && !(DB.settings && DB.settings.invoiceToShip)) {
    DB.settings = DB.settings || {}; DB.settings.invoiceToShip = clone(window.SEED.settings.invoiceToShip);
    if (!DB.settings.invoiceTo || /RED CORAL/i.test(DB.settings.invoiceTo.name || '')) DB.settings.invoiceTo = clone(window.SEED.settings.invoiceTo);
    if (DB.settings.company && window.SEED.settings.company) DB.settings.company.name = window.SEED.settings.company.name;
    save();
  }
  if (window.SEED.settings && window.SEED.settings.invoiceToShip && DB.settings && DB.settings.invoiceToShip && DB.settings.invMig !== 2) {
    var SI = window.SEED.settings;
    Object.keys(SI.invoiceToShip).forEach(function (k) { var d = DB.settings.invoiceToShip[k] = DB.settings.invoiceToShip[k] || clone(SI.invoiceToShip[k]); d.email = SI.invoiceToShip[k].email; if (!d.vat) d.vat = SI.invoiceToShip[k].vat; });
    if (DB.settings.invoiceTo) { DB.settings.invoiceTo.email = SI.invoiceTo.email; if (!DB.settings.invoiceTo.vat) DB.settings.invoiceTo.vat = SI.invoiceTo.vat; }
    DB.settings.invMig = 2; save();
  }
  if (!DB.warehouses && window.SEED.warehouses) { DB.warehouses = clone(window.SEED.warehouses); save(); }
  DB.settings = DB.settings || {};
  if (!DB.settings.approval) DB.settings.approval = { auto: 2500, mgr: 'Direttore tecnico', mgrMax: 25000, top: 'Armatore' };
  if (!DB.settings.landed) DB.settings.landed = { EU: { pct: 4, min: 60 }, EXTRA: { pct: 8, min: 150 }, ASIA: { pct: 11, min: 250 }, hub: 90, customs: 3 };
  ensureDemo();
  if (!DB.settings && window.SEED.settings) { DB.settings = clone(window.SEED.settings); save(); }
  render();
})();
