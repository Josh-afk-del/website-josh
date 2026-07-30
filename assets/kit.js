/* Shared Kit (ConvertKit) subscribe helper.
 * Both lead magnets — the Capacity Audit and The Off Switch — use the SAME form.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  TODO (Valentin): paste Josh's real values before launch.
 *  Kit dashboard → Grow → Landing Pages & Forms → the shared form → Embed → API.
 *  FORM_ID is in the form's URL. API_KEY is under Settings → Advanced → API Keys
 *  (the public v3 API key is safe to ship in client-side code).
 * ─────────────────────────────────────────────────────────────────────────
 */
window.KIT = {
  FORM_ID: "9744081",
  API_KEY: "jlzARMl3ETOc5wutr2l_6g"
};

/**
 * Subscribe an email to the shared Kit form.
 * @param {{email:string, firstName?:string, source?:string}} data
 * @returns {Promise<boolean>} resolves true on success, false on failure.
 */
window.kitSubscribe = function kitSubscribe({ email, firstName = "", source = "" }) {
  if (!email) return Promise.resolve(false);
  if (!window.KIT.FORM_ID || !window.KIT.API_KEY || window.KIT.FORM_ID.indexOf("REPLACE_WITH") === 0 || window.KIT.API_KEY.indexOf("REPLACE_WITH") === 0) {
    console.warn("[Kit] form connection is not set yet — skipping live subscribe. See assets/kit.js.");
    return Promise.resolve(false);
  }
  return fetch(`https://api.convertkit.com/v3/forms/${window.KIT.FORM_ID}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: window.KIT.API_KEY,
      email,
      first_name: firstName,
      fields: source ? { source } : undefined
    })
  })
    .then((res) => res.ok)
    .catch((error) => {
      console.warn("[Kit] subscribe failed", error);
      return false;
    });
};
