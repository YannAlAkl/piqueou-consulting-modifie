<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class ProfessionalEmail implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
        protected array $blockedDomains = [
        'gmail.com', 'googlemail.com',
        'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'msn.com',
        'yahoo.com', 'yahoo.fr',
        'icloud.com', 'me.com', 'mac.com',
        'aol.com',
        'protonmail.com', 'proton.me',
        'gmx.com', 'gmx.fr',
        'yandex.com', 'yandex.ru',
        'mail.com',
        'laposte.net',
        'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr',
        'zoho.com'
        ];
        public function validate(string $attribute, mixed $value, Closure $fail): void
        {
            $domain = strtolower(substr(strrchr($value, '@'),1));

            if (in_array($domain, $this->blockedDomains, true)) {
                $fail('Merci d\'utiliser votre adresse email professionnelle (les adresse Gmail, Hotmail et autres fournisseurs grand public ne sont pas acceptées). ');
            }
        }

    }

