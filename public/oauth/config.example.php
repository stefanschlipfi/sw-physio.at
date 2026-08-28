<?php
/**
 * Template for the credentials of the OAuth proxy.
 *
 * Copy it to public/oauth/config.php on the server (or generate that file from
 * the deployment secrets) and fill in the values. The copy is excluded from the
 * repository via .gitignore – the client secret must never be committed.
 *
 * The matching GitHub OAuth app (Settings → Developer settings → OAuth Apps)
 * needs:
 *   Homepage URL:               https://sw-physio.at
 *   Authorization callback URL: https://sw-physio.at/oauth/
 */

declare(strict_types=1);

return [
    'client_id' => 'HIER_DIE_CLIENT_ID',
    'client_secret' => 'HIER_DAS_CLIENT_SECRET',
];
