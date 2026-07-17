<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users: add missing columns if table exists, otherwise create
        if (Schema::hasTable('users')) {
            if (!Schema::hasColumn('users', 'first_name') || !Schema::hasColumn('users', 'last_name') || !Schema::hasColumn('users', 'company_name')) {
                Schema::table('users', function (Blueprint $table) {
                    if (!Schema::hasColumn('users', 'first_name')) {
                        $table->string('first_name')->nullable()->after('id');
                    }
                    if (!Schema::hasColumn('users', 'last_name')) {
                        $table->string('last_name')->nullable()->after('first_name');
                    }
                    if (!Schema::hasColumn('users', 'company_name')) {
                        $table->string('company_name')->nullable()->after('password');
                    }
                    if (!Schema::hasColumn('users', 'phone')) {
                        $table->string('phone', 30)->nullable()->after('company_name');
                    }
                    if (!Schema::hasColumn('users', 'account_status')) {
                        $table->enum('account_status', ['pending','active','inactive'])->default('pending')->after('phone');
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
                });
            }
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

        // Password reset tokens: create if missing
        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        // Sessions: ensure table exists and has foreign key to users
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
            } else {
                // try to add foreign key if not exists
                try {
                    DB::statement('ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE');
                } catch (\Throwable $e) {
                    // ignore if constraint already exists or cannot be added
                }
            }
        }

        // Roles table
        if (!Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table) {
                $table->id();
                $table->string('name', 50);
                $table->timestamps();
            });
        }

        // role_user pivot
        if (!Schema::hasTable('role_user')) {
            Schema::create('role_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('role_id')->constrained()->cascadeOnDelete();
                $table->timestamps();
            });
        } else {
            Schema::table('role_user', function (Blueprint $table) {
                if (!Schema::hasColumn('role_user', 'user_id')) {
                    $table->foreignId('user_id')->constrained()->cascadeOnDelete()->after('id');
                }
                if (!Schema::hasColumn('role_user', 'role_id')) {
                    $table->foreignId('role_id')->constrained()->cascadeOnDelete()->after('user_id');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Do not drop user data on rollback to be safe; only drop tables created by this migration if they did not exist before.
        // For safety, we will not implement destructive down() operations here.
    }
};
