
// Utilidades de armazenamento
const getData = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setData = (key, arr) => localStorage.setItem(key, JSON.stringify(arr));
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Inicializador por página
function pageInit(kind){
  if(kind === 'cadastro-filmes'){
    const form = document.getElementById('formFilme');
    const tbody = document.querySelector('#tabelaFilmes tbody');
    render();
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const filme = {
        id: genId(),
        titulo: document.getElementById('titulo').value.trim(),
        genero: document.getElementById('genero').value,
        descricao: document.getElementById('descricao').value.trim(),
        classificacao: document.getElementById('classificacao').value,
        duracao: Number(document.getElementById('duracao').value),
        estreia: document.getElementById('estreia').value
      };
      const filmes = getData('filmes'); filmes.push(filme); setData('filmes', filmes);
      form.reset(); render();
    });
    function render(){
      const filmes = getData('filmes');
      tbody.innerHTML = filmes.map(f =>
        `<tr><td>${f.titulo}</td><td>${f.genero}</td><td>${f.classificacao}</td><td>${f.duracao} min</td><td>${f.estreia}</td></tr>`
      ).join('');
    }
  }

  if(kind === 'cadastro-salas'){
    const form = document.getElementById('formSala');
    const tbody = document.querySelector('#tabelaSalas tbody');
    render();
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const sala = {
        id: genId(),
        nome: document.getElementById('nomeSala').value.trim(),
        capacidade: Number(document.getElementById('capacidade').value),
        tipo: document.getElementById('tipo').value
      };
      const salas = getData('salas'); salas.push(sala); setData('salas', salas);
      form.reset(); render();
    });
    function render(){
      const salas = getData('salas');
      tbody.innerHTML = salas.map(s =>
        `<tr><td>${s.nome}</td><td>${s.capacidade}</td><td>${s.tipo}</td></tr>`
      ).join('');
    }
  }

  if(kind === 'cadastro-sessoes'){
    const filmes = getData('filmes');
    const salas = getData('salas');
    const selFilme = document.getElementById('filmeSelect');
    const selSala = document.getElementById('salaSelect');
    if(filmes.length===0 || salas.length===0){
      selFilme.innerHTML = '<option disabled selected>Cadastre filmes e salas primeiro</option>';
      selSala.innerHTML = '<option disabled selected>Cadastre filmes e salas primeiro</option>';
    } else {
      selFilme.innerHTML = '<option value="" disabled selected>Escolha...</option>' + filmes.map(f=>`<option value="${f.id}">${f.titulo}</option>`).join('');
      selSala.innerHTML = '<option value="" disabled selected>Escolha...</option>' + salas.map(s=>`<option value="${s.id}">${s.nome} (${s.tipo})</option>`).join('');
    }
    const form = document.getElementById('formSessao');
    const tbody = document.querySelector('#tabelaSessoes tbody');
    render();
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const sessoes = getData('sessoes');
      const sessao = {
        id: genId(),
        filmeId: selFilme.value,
        salaId: selSala.value,
        datahora: document.getElementById('datahora').value,
        preco: Number(document.getElementById('preco').value),
        idioma: document.getElementById('idioma').value,
        formato: document.getElementById('formato').value
      };
      sessoes.push(sessao); setData('sessoes', sessoes);
      form.reset(); render();
    });
    function render(){
      const sessoes = getData('sessoes');
      const filmes = getData('filmes'); const salas = getData('salas');
      tbody.innerHTML = sessoes.map(s=>{
        const f = filmes.find(x=>x.id===s.filmeId); const sala = salas.find(x=>x.id===s.salaId);
        return `<tr><td>${f?f.titulo:'?'}</td><td>${sala?sala.nome:'?'}</td><td>${s.datahora.replace('T',' ')}</td><td>R$ ${s.preco.toFixed(2)}</td><td>${s.idioma}</td><td>${s.formato}</td></tr>`;
      }).join('');
    }
  }

  if(kind === 'listar'){
    const tbody = document.querySelector('#tabelaLista tbody');
    render();
    function render(){
      const sessoes = getData('sessoes');
      const filmes = getData('filmes'); const salas = getData('salas');
      tbody.innerHTML = sessoes.map(s=>{
        const f = filmes.find(x=>x.id===s.filmeId); const sala = salas.find(x=>x.id===s.salaId);
        const label = encodeURIComponent(`${f?f.titulo:''} - ${sala?sala.nome:''} - ${s.datahora}`);
        return `<tr>
          <td>${f?f.titulo:''}</td>
          <td>${sala?sala.nome:''}</td>
          <td>${s.datahora.replace('T',' ')}</td>
          <td>R$ ${Number(s.preco).toFixed(2)}</td>
          <td><a class="btn btn-sm btn-primary" href="venda-ingressos.html?sessaoId=${s.id}&label=${label}">Comprar</a></td>
        </tr>`;
      }).join('');
    }
  }

  if(kind === 'venda'){
    const sessoes = getData('sessoes');
    const filmes = getData('filmes'); const salas = getData('salas');
    const sel = document.getElementById('sessaoSelect');
    const hint = document.getElementById('hintSessoes');
    if(sessoes.length===0){ hint.style.display='block'; }
    const query = new URLSearchParams(location.search);
    const sessaoIdURL = query.get('sessaoId');
    sel.innerHTML = sessoes.map(s=>{
      const f = filmes.find(x=>x.id===s.filmeId); const sala = salas.find(x=>x.id===s.salaId);
      const text = `${f?f.titulo:''} - ${sala?sala.nome:''} - ${s.datahora.replace('T',' ')} - R$ ${Number(s.preco).toFixed(2)}`;
      const selected = (s.id===sessaoIdURL) ? 'selected' : '';
      return `<option value="${s.id}" ${selected}>${text}</option>`;
    }).join('');
    const form = document.getElementById('formVenda');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const ingresso = {
        id: genId(),
        sessaoId: sel.value,
        cliente: document.getElementById('cliente').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        assento: document.getElementById('assento').value.trim(),
        pagamento: document.getElementById('pagamento').value,
        dataVenda: new Date().toISOString()
      };
      const ingressos = getData('ingressos'); ingressos.push(ingresso); setData('ingressos', ingressos);
      alert('Venda registrada com sucesso!');
      form.reset();
    });
  }
}
