<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->has('role') || $request->has('role_id')) {
            abort(403,'Non autorisé');
        }
        $request->validate([
            'first_name'=>['required','string' , 'max:255'],
            'last_name'=>['required','nullable', 'string', 'max:255'],
            'email'=>['required', 'string', 'email', 'max:255', 'unique:'.User::class, new ProfessionalEmail],
            'password'=>['required', 'confirmed', Rules\Password::defaults()],
            'company_name'=>['nullable', 'string', 'max:255'],
            'phone'=>['nullable', 'string', 'max:30'],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password'=> hash::make($request->password),
            'company_name'=> $request->company_name,
            'phone'=> $request->phone,
            'account_status' => 'pending'

        ]);

        $user->assignRole('client');

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
