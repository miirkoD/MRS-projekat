'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

type Subscription = {
  _key: string;
  planType: string;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
};

export function SubscriptionTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user._key || user.id;

        const response = await fetch(`/api/subscriptions?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          const sortedSubscriptions = (data.subscriptions || []).sort(
            (a: Subscription, b: Subscription) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setSubscriptions(sortedSubscriptions);
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  if (isLoading) {
    return <div className="text-center py-8">Učitavanje...</div>;
  }

  return (
    <Table>
      <TableCaption>Lista vaših pretplata.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Početak</TableHead>
          <TableHead>Kraj</TableHead>
          <TableHead className="text-right">Cena</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500">
              Nemate aktivnih pretplata.
            </TableCell>
          </TableRow>
        ) : (
          subscriptions.map((subscription) => (
            <TableRow key={subscription._key}>
              <TableCell className="font-medium">
                {subscription.planType}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    subscription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {subscription.status === 'active' ? 'Aktivna' : 'Neaktivna'}
                </span>
              </TableCell>
              <TableCell>{formatDate(subscription.startDate)}</TableCell>
              <TableCell>{formatDate(subscription.endDate)}</TableCell>
              <TableCell className="text-right">
                ${subscription.price}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      {subscriptions.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Ukupno</TableCell>
            <TableCell className="text-right">${totalAmount}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
