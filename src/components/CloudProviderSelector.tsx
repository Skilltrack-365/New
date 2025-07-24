import React, { useState, useEffect } from 'react';
import { Cloud, Zap, DollarSign, Clock, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CloudProvider {
  id: string;
  name: string;
  provider_type: 'aws' | 'azure' | 'gcp';
  display_name: string;
  description: string;
  logo_url?: string;
  regions: string[];
  supported_services: string[];
  pricing_model: any;
  is_active: boolean;
}

interface CloudAccount {
  id: string;
  provider_id: string;
  account_name: string;
  account_id: string;
  region: string;
  is_verified: boolean;
  is_active: boolean;
  monthly_budget: number;
  current_spend: number;
}

interface CloudProviderSelectorProps {
  labId: string;
  onProviderSelect: (provider: CloudProvider, account: CloudAccount) => void;
  onCancel: () => void;
}

const CloudProviderSelector: React.FC<CloudProviderSelectorProps> = ({
  labId,
  onProviderSelect,
  onCancel
}) => {
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [accounts, setAccounts] = useState<CloudAccount[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<CloudAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccountSetup, setShowAccountSetup] = useState(false);

  useEffect(() => {
    fetchProvidersAndAccounts();
  }, []);

  const fetchProvidersAndAccounts = async () => {
    try {
      const [providersResult, accountsResult] = await Promise.all([
        supabase.from('cloud_providers').select('*').eq('is_active', true),
        supabase.from('cloud_accounts').select('*').eq('is_active', true)
      ]);

      if (providersResult.data) setProviders(providersResult.data);
      if (accountsResult.data) setAccounts(accountsResult.data);
    } catch (error) {
      console.error('Error fetching cloud data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderLogo = (providerType: string) => {
    switch (providerType) {
      case 'aws':
        return '🟠'; // AWS Orange
      case 'azure':
        return '🔵'; // Azure Blue
      case 'gcp':
        return '🔴'; // GCP Red
      default:
        return '☁️';
    }
  };

  const getProviderAccounts = (providerId: string) => {
    return accounts.filter(account => account.provider_id === providerId && account.is_verified);
  };

  const handleProviderSelect = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    const providerAccounts = getProviderAccounts(provider.id);
    
    if (providerAccounts.length === 0) {
      setShowAccountSetup(true);
    } else if (providerAccounts.length === 1) {
      setSelectedAccount(providerAccounts[0]);
    }
  };

  const handleAccountSelect = (account: CloudAccount) => {
    setSelectedAccount(account);
  };

  const handleContinue = () => {
    if (selectedProvider && selectedAccount) {
      onProviderSelect(selectedProvider, selectedAccount);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showAccountSetup) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Cloud className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your {selectedProvider?.display_name} Account
          </h2>
          <p className="text-gray-600">
            To launch real cloud environments, you need to connect your cloud account.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Important Security Notice</h3>
              <p className="text-yellow-700 text-sm">
                Your cloud credentials are encrypted and stored securely. We only provision resources 
                with your explicit permission and automatically clean them up after your session ends.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">What you'll need:</h3>
          <div className="grid grid-cols-1 gap-3">
            {selectedProvider?.provider_type === 'aws' && (
              <>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">AWS Access Key ID</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">AWS Secret Access Key</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Preferred AWS Region</span>
                </div>
              </>
            )}
            {selectedProvider?.provider_type === 'azure' && (
              <>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Azure Subscription ID</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Service Principal credentials</span>
                </div>
              </>
            )}
            {selectedProvider?.provider_type === 'gcp' && (
              <>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">GCP Project ID</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Service Account Key (JSON)</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowAccountSetup(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              // In a real implementation, this would open a secure account connection flow
              alert('Account setup flow would open here');
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Connect Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Cloud className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Cloud Environment
        </h2>
        <p className="text-gray-600">
          Launch your lab in a real cloud environment with live infrastructure
        </p>
      </div>

      {!selectedProvider ? (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {providers.map((provider) => (
            <div
              key={provider.id}
              onClick={() => handleProviderSelect(provider)}
              className="border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{getProviderLogo(provider.provider_type)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {provider.display_name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {provider.description}
                </p>
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-center">
                    <Zap className="w-3 h-3 mr-1" />
                    {provider.regions.length} regions
                  </div>
                  <div className="flex items-center justify-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {provider.supported_services.length} services
                  </div>
                </div>

                <div className="mt-4">
                  {getProviderAccounts(provider.id).length > 0 ? (
                    <div className="flex items-center justify-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Account Connected
                    </div>
                  ) : (
                    <div className="text-orange-600 text-sm">
                      Account Setup Required
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl mr-3">{getProviderLogo(selectedProvider.provider_type)}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedProvider.display_name}</h3>
                <p className="text-sm text-gray-600">Selected cloud provider</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProvider(null);
                setSelectedAccount(null);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Change
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Account</h3>
            <div className="grid gap-4">
              {getProviderAccounts(selectedProvider.id).map((account) => (
                <div
                  key={account.id}
                  onClick={() => handleAccountSelect(account)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAccount?.id === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{account.account_name}</h4>
                      <p className="text-sm text-gray-600">
                        {account.account_id} • {account.region}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${account.current_spend.toFixed(2)} / ${account.monthly_budget.toFixed(2)}
                      </div>
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedAccount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Session Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Max Duration: 2 hours</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Estimated Cost: $0.50/hour</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Auto-cleanup: Enabled</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Region: {selectedAccount.region}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
        
        {selectedProvider && selectedAccount && (
          <button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch Cloud Environment
          </button>
        )}
      </div>
    </div>
  );
};

export default CloudProviderSelector;