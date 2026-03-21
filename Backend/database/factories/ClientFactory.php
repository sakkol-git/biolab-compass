<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ClientType;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Client> */
class ClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_code' => strtoupper($this->faker->unique()->bothify('CLT-####')),
            'company_name' => $this->faker->company(),
            'contact_name' => $this->faker->name(),
            'email' => $this->faker->optional()->companyEmail(),
            'phone' => $this->faker->optional()->phoneNumber(),
            'address' => $this->faker->optional()->address(),
            'client_type' => $this->faker->randomElement(ClientType::cases()),
            'notes' => $this->faker->optional()->sentence(),
            'total_contracts' => 0,
            'total_value' => 0,
        ];
    }

    public function farmOwner(): static
    {
        return $this->state(['client_type' => ClientType::FARM_OWNER]);
    }

    public function investor(): static
    {
        return $this->state(['client_type' => ClientType::INVESTOR]);
    }

    public function government(): static
    {
        return $this->state(['client_type' => ClientType::GOVERNMENT]);
    }

    public function ngo(): static
    {
        return $this->state(['client_type' => ClientType::NGO]);
    }

    public function researchPartner(): static
    {
        return $this->state(['client_type' => ClientType::RESEARCH_PARTNER]);
    }
}
