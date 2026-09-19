
(() => {
  const CFG = window.ENGSTEP_CONFIG || {};
  const enabled = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
  let client = null;
  let user = null;

  if (enabled) {
    client = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }

  function uid() { return user?.id || null; }
  function localAttempts() {
    try { return JSON.parse(localStorage.getItem('engstep_attempts_v2') || '[]'); }
    catch { return []; }
  }
  function setLocalAttempts(rows) {
    localStorage.setItem('engstep_attempts_v2', JSON.stringify(rows));
  }
  function ensureClientId(a) {
    if (!a.client_id) {
      a.client_id = (crypto.randomUUID ? crypto.randomUUID() :
        'c_' + Date.now() + '_' + Math.random().toString(36).slice(2));
    }
    return a;
  }

  async function init() {
    if (!enabled) return { mode: 'local' };
    const { data } = await client.auth.getSession();
    user = data.session?.user || null;
    client.auth.onAuthStateChange(async (_event, session) => {
      user = session?.user || null;
      window.dispatchEvent(new CustomEvent('engstep-auth-changed'));
      if (user) {
        await pullContent();
        await syncAttempts();
      }
    });
    if (user) {
      await pullContent();
      await syncAttempts();
    }
    return { mode: 'cloud', user };
  }

  async function signUp(email, password) {
    if (!enabled) throw new Error('Supabase 설정이 필요합니다.');
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    user = data.user || data.session?.user || null;
    return data;
  }

  async function signIn(email, password) {
    if (!enabled) throw new Error('Supabase 설정이 필요합니다.');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user = data.user;
    await pullContent();
    await syncAttempts();
    return data;
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    user = null;
  }

  async function pushAttempt(attempt) {
    ensureClientId(attempt);
    if (!enabled || !user || !navigator.onLine) return false;
    const row = {
      user_id: user.id,
      client_id: attempt.client_id,
      question_id: attempt.id,
      content_type: attempt.type,
      book_id: attempt.bookId,
      book_title: attempt.bookTitle || '',
      unit_key: attempt.unit,
      question_index: attempt.index,
      is_correct: !!attempt.ok,
      given_answer: String(attempt.given ?? ''),
      study_mode: attempt.mode || 'unit',
      answered_at: attempt.ts
    };
    const { error } = await client.from('attempts').upsert(row, { onConflict: 'user_id,client_id' });
    if (error) { console.warn('EngStep cloud push failed', error); return false; }
    return true;
  }

  async function syncAttempts() {
    if (!enabled || !user || !navigator.onLine) return { pushed: 0, pulled: 0 };
    let local = localAttempts().map(ensureClientId);
    setLocalAttempts(local);

    let pushed = 0;
    for (const a of local) if (await pushAttempt(a)) pushed++;

    const { data, error } = await client.from('attempts')
      .select('*').eq('user_id', user.id).order('answered_at', { ascending: true });
    if (error) throw error;

    const byClient = new Map(local.map(a => [a.client_id, a]));
    for (const r of (data || [])) {
      if (!byClient.has(r.client_id)) {
        const a = {
          client_id: r.client_id, id: r.question_id, type: r.content_type,
          bookId: r.book_id, bookTitle: r.book_title, unit: r.unit_key,
          index: r.question_index, ok: r.is_correct, given: r.given_answer,
          mode: r.study_mode, ts: r.answered_at
        };
        local.push(a); byClient.set(a.client_id, a);
      }
    }
    local.sort((a,b) => new Date(a.ts) - new Date(b.ts));
    setLocalAttempts(local);
    window.dispatchEvent(new CustomEvent('engstep-sync-complete'));
    return { pushed, pulled: data?.length || 0 };
  }

  async function pullContent() {
    if (!enabled || !navigator.onLine) return [];
    const { data, error } = await client.from('books')
      .select('book_id,version,pack').eq('is_published', true);
    if (error) { console.warn('EngStep content pull failed', error); return []; }
    const remote = (data || []).map(x => x.pack).filter(Boolean);
    localStorage.setItem('engstep_cloud_books_v3', JSON.stringify(remote));
    window.ENGSTEP_CLOUD_PACKS = remote;
    window.dispatchEvent(new CustomEvent('engstep-content-updated'));
    return remote;
  }

  window.EngStepCloud = {
    enabled, init, signUp, signIn, signOut, syncAttempts, pushAttempt, pullContent,
    getUser: () => user, isConfigured: () => enabled
  };
})();
