import React from 'react';
import { Card, Button } from '@/components/ui';

export default function SelectedInfo({ place }) {
  return (
    <Card className="p-4 bg-white rounded shadow-lg">
      <h4 className="font-bold">Restaurant sélectionné</h4>
      <p>{place.name}, {place.address}</p>
      <Button className="mt-3">Continuer</Button>
    </Card>
  );
}
