import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaExchangeAlt } from 'react-icons/fa';
import { FaPix } from "react-icons/fa6";
import { QRCodeSVG } from 'qrcode.react';

const TransferModal = ({ onClose , users}) => {
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState('PIX');
  const [formData, setFormData] = useState({
    amount: '',
    recipientName: '',
    transactionPassword: '',
    // TED
    bank: '',
    agency: '',
    account: '',
    // PIX
    pixKey: '',
    pixType: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, transfer } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) throw new Error('Valor inválido');
      if (amount > user.balance) throw new Error('Saldo insuficiente');
      if (formData.transactionPassword !== '1234') throw new Error('Senha transacional incorreta');

      const recipientUser = users.find(u => u.id !== user.id);
      if (!recipientUser) throw new Error('Nenhum destinatário válido encontrado');
 
      await transfer({
        type: transferType,
        amount,
        recipientName: formData.recipientName,
        ...(transferType === 'TED' && {
          bank: formData.bank,
          agency: formData.agency,
          account: formData.account
        }),
        ...(transferType === 'PIX' && {
          pixKey: formData.pixKey,
          pixType: formData.pixType
        }),
        recipientId: recipientUser.id
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao realizar transferência');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {step === 1 ? 'Tipo de Transferência' : 'Dados da Transferência'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setTransferType('PIX');
                  setStep(2);
                }}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaPix className="text-blue-600 text-xl" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Transferência via PIX</h4>
                  <p className="text-sm text-gray-500">Instantâneo e gratuito</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTransferType('TED');
                  setStep(2);
                }}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaExchangeAlt className="text-blue-600 text-xl" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">Transferência via TED</h4>
                  <p className="text-sm text-gray-500">Concluída em até 1 dia útil</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">R$</span>
                  </div>
                  <input
                    type="text"
                    name="amount"
                    value={new Intl.NumberFormat('pt-BR').format(Number(formData.amount || 0))}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0,00"
                    inputMode="decimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Favorecido
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome completo"
                />
              </div>

              {transferType === 'TED' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banco
                    </label>
                    <input
                      type="text"
                      name="bank"
                      value={formData.bank}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Código ou nome do banco"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agência
                      </label>
                      <input
                        type="text"
                        name="agency"
                        value={formData.agency}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número da agência"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conta
                      </label>
                      <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número da conta"
                      />
                    </div>
                  </div>
                </>
              )}

              {transferType === 'PIX' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Chave PIX
                    </label>
                    <select
                      name="pixType"
                      value={formData.pixType}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                      <option value=""></option>
                      <option value="CPF">CPF</option>
                      <option value="Email">E-mail</option>
                      <option value="Phone">Telefone</option>
                      <option value="Random">Chave Aleatória</option>
                      <option value="QRCode">QRCode</option>
                    </select>
                  </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chave PIX
                        </label>
                        <input
                          type="text"
                          name="pixKey"
                          value={formData.pixType == 'QRCode' ? 'dcta478j-196l-03fm-t6gh-4298er7845m2' : formData.pixKey}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder={
                            formData.pixType === 'CPF' ? '000.000.000-00' :
                              formData.pixType === 'Email' ? 'email@exemplo.com' :
                                formData.pixType === 'Phone' ? '(00) 00000-0000' :
                                  '00000000-0000-0000-0000-000000000000' 
                          }
                        />
                      </div>

                    {transferType === 'PIX' && formData.recipientName && formData.pixKey && formData.pixType == 'QRCode' && (
                      <div className="inline-flex w-full items-center justify-center bg-white p-2 border rounded transition-all duration-300 ease-in-out">
                        <QRCodeSVG
                          value={JSON.stringify({
                            pixKey: formData.pixType == 'QRCode' ? 'dcta478j-196l-03fm-t6gh-4298er7845m2' : formData.pixKey,
                            pixType: formData.pixType,
                            amount: formData.amount,
                            name: formData.recipientName
                          })}
                          size={180}
                        />
                        {}
                      </div>
                    )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Transacional
                    (senha para transferências Fictícias: 1234)
                </label>
                <input
                  type="password"
                  name="transactionPassword"
                  value={formData.transactionPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite sua senha de transações"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-700 font-medium text-sm"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.amount || !formData.recipientName}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processando...' : 'Confirmar Transferência'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransferModal;