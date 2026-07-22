<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['first_name', 'last_name', 'email', 'password', 'company_name', 'phone', 'account_status', 'activated_at', 'wants_newsletter', 'newsletter_category'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'company_name',
        'phone',
        'account_status',
        'activated_at',
        'wants_newsletter',
        'newsletter_category'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function role(): ?Role
    {
        return $this->roles()->first();
    }

    public function assignRole(string $roleName): self
    {
        $role = Role::firstOrCreate(['name' => $roleName]);

        $this->roles()->syncWithoutDetaching([$role->id]);

        return $this;
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

}
