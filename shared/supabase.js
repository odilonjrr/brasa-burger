(() => {
  let client = null;
  let configured = false;
  let initPromise = null;
  const clean = (value) => typeof value === 'string' ? value.trim() : value;
  async function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      try {
        if (!window.supabase?.createClient) return false;
        const response = await fetch('/api/config', { credentials: 'same-origin', cache: 'no-store' });
        if (!response.ok) return false;
        const cfg = await response.json();
        if (!cfg.configured || !cfg.supabaseUrl || !cfg.publishableKey) return false;
        client = window.supabase.createClient(cfg.supabaseUrl, cfg.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
        configured = true;
        return true;
      } catch (err) { console.warn('[BrasaSupabase] modo offline:', err?.message || err); return false; }
    })();
    return initPromise;
  }
  function db(){ if(!client) throw new Error('Supabase não inicializado.'); return client; }
  async function session(){ await init(); if(!client) return null; const {data}=await client.auth.getSession(); return data.session||null; }
  async function user(){ await init(); if(!client) return null; const {data}=await client.auth.getUser(); return data.user||null; }
  async function signIn(email,password){ await init(); if(!client) throw new Error('Supabase não configurado.'); const {data,error}=await client.auth.signInWithPassword({email:clean(email),password}); if(error) throw error; return data; }
  async function signUp({email,password,fullName,phone}){ await init(); if(!client) throw new Error('Supabase não configurado.'); const {data,error}=await client.auth.signUp({email:clean(email),password,options:{data:{full_name:clean(fullName),phone:clean(phone)}}}); if(error) throw error; return data; }
  async function signOut(){ await init(); if(client) await client.auth.signOut(); }
  async function getStaffRole(){ const u=await user(); if(!u) return null; const {data,error}=await db().from('staff_roles').select('role').eq('user_id',u.id).maybeSingle(); if(error) return null; return data?.role||null; }
  async function listProducts(){ await init(); if(!client) return []; const {data,error}=await db().from('products').select('id,name,description,price,promotional_price,image_url,active,sold_out,featured,categories(name)').eq('active',true).order('display_order',{ascending:true}); if(error) throw error; return data||[]; }
  async function listCategories(){ await init(); if(!client) return []; const {data,error}=await db().from('categories').select('*').eq('active',true).order('display_order'); if(error) throw error; return data||[]; }
  async function listAreas(){ await init(); if(!client) return []; const {data,error}=await db().from('delivery_areas').select('*').eq('active',true).order('name'); if(error) throw error; return data||[]; }
  async function invoke(functionName,body){ await init(); if(!client) throw new Error('Supabase não configurado.'); const {data,error}=await client.functions.invoke(functionName,{body}); if(error) throw error; return data; }
  async function createOrder(payload){ return invoke('create-order',payload); }
  async function getMyOrders(){ await init(); if(!client) return []; const {data,error}=await db().from('orders').select('id,public_number,status,total,delivery_mode,created_at').order('created_at',{ascending:false}); if(error) throw error; return data||[]; }
  async function adminHydrate(){
    await init(); if(!client) return null;
    const role=await getStaffRole(); if(!role) throw new Error('Usuário sem permissão administrativa.');
    const [orders,products,categories,addons,coupons,areas,banners,settings]=await Promise.all([
      db().from('orders').select('*,order_items(*,order_item_addons(*))').order('created_at',{ascending:false}).limit(150),
      db().from('products').select('*,categories(name)').order('display_order'),
      db().from('categories').select('*').order('display_order'),
      db().from('addon_groups').select('*,addon_options(*)').order('name'),
      db().from('coupons').select('*').order('created_at',{ascending:false}),
      db().from('delivery_areas').select('*').order('name'),
      db().from('banners').select('*').order('display_order'),
      db().from('store_settings').select('*').eq('id','main').maybeSingle()
    ]);
    for(const result of [orders,products,categories,addons,coupons,areas,banners,settings]) if(result.error) throw result.error;
    return {role,orders:orders.data||[],products:products.data||[],categories:categories.data||[],addons:addons.data||[],coupons:coupons.data||[],areas:areas.data||[],banners:banners.data||[],settings:settings.data||null};
  }
  async function adminUpsert(table,payload){ await init(); if(!client) return null; const {data,error}=await db().from(table).upsert(payload).select(); if(error) throw error; return data; }
  async function adminInsert(table,payload){ await init(); if(!client) return null; const {data,error}=await db().from(table).insert(payload).select(); if(error) throw error; return data; }
  async function adminUpdate(table,id,payload){ await init(); if(!client) return null; const {data,error}=await db().from(table).update(payload).eq('id',id).select(); if(error) throw error; return data; }
  async function adminDelete(table,id){ await init(); if(!client) return; const {error}=await db().from(table).delete().eq('id',id); if(error) throw error; }
  async function adminCreateOrder(payload){ await init(); if(!client) throw new Error('Supabase não configurado.'); const {data,error}=await db().rpc('admin_create_order',{p_payload:payload,p_idempotency_key:crypto.randomUUID()}); if(error) throw error; return data; }
  async function adminUpdateOrderStatus(id,status){ await init(); if(!client) return; const {error}=await db().rpc('admin_set_order_status',{p_order_id:id,p_status:status}); if(error) throw error; }
  async function adminSaveSettings(payload){ await init(); if(!client) return null; const data={...payload,id:'main',updated_at:new Date().toISOString()}; const {data:rows,error}=await db().from('store_settings').upsert(data).select(); if(error) throw error; return rows?.[0]||null; }
  window.BrasaSupabase={init,db,isConfigured:()=>configured,session,user,signIn,signUp,signOut,getStaffRole,listProducts,listCategories,listAreas,createOrder,getMyOrders,adminHydrate,adminUpsert,adminInsert,adminUpdate,adminDelete,adminCreateOrder,adminUpdateOrderStatus,adminSaveSettings};
})();
