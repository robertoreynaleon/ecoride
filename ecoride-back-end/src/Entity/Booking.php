<?php

namespace App\Entity;

use App\Repository\BookingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookingRepository::class)]
class Booking
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ride $ride = null;

    #[ORM\ManyToOne(inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $passenger = null;

    #[ORM\Column]
    private ?int $placesBooked = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $bookingDate = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2)]
    private ?string $priceTotal = null;

    #[ORM\Column(length: 30)]
    private ?string $status = 'pending';

    public function __construct()
    {
        $this->bookingDate = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRide(): ?Ride
    {
        return $this->ride;
    }

    public function setRide(?Ride $ride): static
    {
        $this->ride = $ride;

        return $this;
    }

    public function getPassenger(): ?User
    {
        return $this->passenger;
    }

    public function setPassenger(?User $passenger): static
    {
        $this->passenger = $passenger;

        return $this;
    }

    public function getPlacesBooked(): ?int
    {
        return $this->placesBooked;
    }

    public function setPlacesBooked(int $placesBooked): static
    {
        $this->placesBooked = $placesBooked;

        return $this;
    }

    public function getBookingDate(): ?\DateTimeImmutable
    {
        return $this->bookingDate;
    }

    public function setBookingDate(\DateTimeImmutable $bookingDate): static
    {
        $this->bookingDate = $bookingDate;

        return $this;
    }

    public function getPriceTotal(): ?string
    {
        return $this->priceTotal;
    }

    public function setPriceTotal(string $priceTotal): static
    {
        $this->priceTotal = $priceTotal;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }
}
