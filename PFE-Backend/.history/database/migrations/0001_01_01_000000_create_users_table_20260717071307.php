<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
        // Create or update users table to match the project auth schema
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'first_name')) {
                    $table->string('first_name')->nullable()->after('id');
                }
                if (!Schema::hasColumn('users', 'last_name')) {
                    $table->string('last_name')->nullable()->after('first_name');
                }
                if (!Schema::hasColumn('users', 'email')) {
                    $table->string('email')->unique()->after('last_name');
                }
                if (!Schema::hasColumn('users', 'email_verified_at')) {
                    $table->timestamp('email_verified_at')->nullable()->after('email');
                }
                if (!Schema::hasColumn('users', 'password')) {
                    $table->string('password')->after('email_verified_at');
                }
                if (!Schema::hasColumn('users', 'company_name')) {
                    $table->string('company_name')->nullable()->after('password');
                }
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone', 30)->nullable()->after('company_name');
                }
                if (!Schema::hasColumn('users', 'account_status')) {
                    $table->enum('account_status', ['pending', 'active', 'inactive'])->default('pending')->after('phone');
                }
                if (!Schema::hasColumn('users', 'activated_at')) {
                    $table->timestamp('activated_at')->nullable()->after('account_status');
                }
                if (!Schema::hasColumn('users', 'wants_newsletter')) {
                    $table->boolean('wants_newsletter')->default(false)->after('activated_at');
                }
                if (!Schema::hasColumn('users', 'newsletter_category')) {
                    $table->string('newsletter_category', 100)->nullable()->after('wants_newsletter');
                }
                if (!Schema::hasColumn('users', 'remember_token')) {
                    $table->rememberToken()->after('newsletter_category');
                }
            });
        } else {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('first_name')->nullable();
                $table->string('last_name')->nullable();
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('company_name')->nullable();
                $table->string('phone', 30)->nullable();
                $table->enum('account_status', ['pending', 'active', 'inactive'])->default('pending');
                $table->timestamp('activated_at')->nullable();
                $table->boolean('wants_newsletter')->default(false);
                $table->string('newsletter_category', 100)->nullable();
                $table->rememberToken();
                $table->timestamps();
            });
        }

        // password_reset_tokens
        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        // sessions
        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        } else {
            if (!Schema::hasColumn('sessions', 'user_id')) {
                Schema::table('sessions', function (Blueprint $table) {
                    $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete()->after('id');
                });
            }
        }
