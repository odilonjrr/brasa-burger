module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ydsvwbureenbdsjcnoga.supabase.co';
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OO5SgL3_CvPOSIeXdWZZYQ_Ds4HdnFc';
  if (!supabaseUrl || !publishableKey) return res.status(503).json({ configured:false, message:'Supabase ainda não configurado neste ambiente.' });
  return res.status(200).json({ configured:true, supabaseUrl, publishableKey });
};