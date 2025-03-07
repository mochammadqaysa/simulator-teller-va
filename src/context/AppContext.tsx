import { useContext, ReactNode, createContext } from "react";
import { z } from "zod";
import { useImmerReducer } from "use-immer";

const Data = z.object({
  nomorVA: z.string(),
  rekeningFeeSumber: z.string(),
  namaProduk: z.string(),
  kodeTransaksi: z.string(),
  rekeningSumber: z.string(),
  nominalFee: z.string(),
  nominalVA: z.string(),
  jenisTransaksi: z.string(),
});

export const InquiryRequest = z.object({
  nomorVA: z.string().default("0"),
  nomorIdentitas: z.string().default("0"),
  kodeInstansi: z.string().default("0"),
  kodeProduk: z.string().default("0"),
  kodeKantorTx: z.string().default("0"),
  kodeBank: z.string().default("0"),
  stan: z.string().default("210595"),
  rrn: z.string().default("110480000001"),
});

export const InquiryResponse = z.object({
  nomorVA: z.string(),
  stan: z.string(),
  nominalTotal: z.string(),
  nomorIdentitas: z.string(),
  jumlahData: z.string(),
  additionalData: z.array(Data),
  message: z.string(),
  namaVA: z.string(),
  status: z.string(),
  rrn: z.string(),
});

export const PaymentVARequest = z.object({
  nomorVA: z.string().default("0"),
  nominalVA: z.string().default("0"),
  kodeTransaksi: z.string().default("0"),
  kodeKantorTx: z.string().default("K"),
  kodeBank: z.string().default("0"),
  stan: z.string().default("210595"),
  rrn: z.string().default("110480000001"),
});

export const FundTransferRequest = z.object({
  transDateTime: z.string(),
  fromAccount: z.string(),
  nominal: z.string(),
  nomorVA: z.string(),
  keterangan: z.string(),
  stan: z.string(),
  rrn: z.string(),
});

export const ResponseStatus = z.object({
  message: z.string(),
  status: z.string(),
});

const State = z.object({
  debug: z.boolean().default(true),
  internalToken: z.string().default(""),
  externalToken: z.string().default(""),
  maxStep: z.number().default(5),
  step: z.number().default(1),
  loading: z.boolean().default(true),
  jenisID: z.number(),
  modeTransaksi: z.string(),
  inquiryRequest: InquiryRequest,
  inquiryResponse: InquiryResponse,
  paymentVARequest: PaymentVARequest,
  paymentVAResponse: ResponseStatus,
  fundTransferRequest: FundTransferRequest,
  fundTransferResponse: ResponseStatus,
});

type Data = z.infer<typeof Data>;
type State = z.infer<typeof State>;
type InquiryRequest = z.infer<typeof InquiryRequest>;
type InquiryResponse = z.infer<typeof InquiryResponse>;
type PaymentVARequest = z.infer<typeof PaymentVARequest>;
type FundTransferRequest = z.infer<typeof FundTransferRequest>;
type ResponseStatus = z.infer<typeof ResponseStatus>;

type Dispatcher = {
  next: () => void;
  back: () => void;
  reset: () => void;
  setStep: (step: number) => void;
  setExternalToken: (token: string) => void;
  setInternalToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setJenisID: (jenisID: number) => void;
  setNoIdentitas: (noIdentitas: string) => void;
  setNoVA: (noVA: string) => void;
  setKodeInstansi: (kodeInstansi: string) => void;
  setKodeProduk: (kodeProduk: string) => void;
  setKodeKantorTx: (kodeKantorTx: string) => void;
  setKodeBank: (kodeBank: string) => void;
  setStan: (stan: string) => void;
  setRrn: (rrn: string) => void;
  setModeTransaksi: (modeTransaksi: string) => void;
  setInquiryResponse: (inquiryResponse: InquiryResponse) => void;
  setPaymentVARequest: (paymentVARequest: PaymentVARequest) => void;
  setPaymentVAResponse: (responseStatus: ResponseStatus) => void;
  setFundTransferRequest: (fundTransferRequest: FundTransferRequest) => void;
  setFundTransferResponse: (responseStatus: ResponseStatus) => void;
  toggleDebug: () => void;
};

const AppContextState = createContext<State | null>(null);
const AppContextDispatch = createContext<Dispatcher | null>(null);

interface Action {
  type: string;
  payload: any;
}

const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case "JENIS_ID":
      draft.jenisID = action.payload;
      return;
    case "NO_IDENTITAS":
      draft.inquiryRequest.nomorIdentitas = action.payload;
      return;
    case "NO_VA":
      draft.inquiryRequest.nomorVA = action.payload;
      return;
    case "KODE_BANK":
      draft.inquiryRequest.kodeBank = action.payload;
      return;
    case "KODE_PRODUK":
      draft.inquiryRequest.kodeProduk = action.payload;
      return;
    case "KODE_INSTANSI":
      draft.inquiryRequest.kodeInstansi = action.payload;
      return;
    case "KODE_KANTOR_TX":
      draft.inquiryRequest.kodeKantorTx = action.payload;
      return;
    case "STAN":
      draft.inquiryRequest.stan = action.payload;
      return;
    case "RRN":
      draft.inquiryRequest.rrn = action.payload;
      return;
    case "NEXT":
      if (draft.step >= draft.maxStep) return;
      if (draft.internalToken === "") return;
      if (draft.externalToken === "") return;
      draft.step = draft.step + 1;
      return;
    case "BACK":
      if (draft.step <= 1) return;
      if (draft.internalToken === "") return;
      if (draft.externalToken === "") return;
      draft.step = draft.step - 1;
      return;
    case "RESET":
      window.location.reload();
      return;
    case "SET_INQUIRY_RESPONSE":
      draft.inquiryResponse = action.payload;
      return;
    case "SET_PAYMENTVA_REQUEST":
      draft.paymentVARequest = action.payload;
      return;
    case "SET_PAYMENTVA_RESPONSE":
      draft.paymentVAResponse = action.payload;
      return;
    case "SET_MODE_TRANSAKSI":
      draft.modeTransaksi = action.payload;
    case "SET_FUNDTRANSFER_REQUEST":
      draft.fundTransferRequest = action.payload;
      return;
    case "SET_FUNDTRANSFER_RESPONSE":
      draft.fundTransferResponse = action.payload;
      return;
    case "SET_LOADING":
      draft.loading = action.payload;
      return;
    case "SET_EXTERNAL_TOKEN":
      draft.externalToken = action.payload;
      return;
    case "SET_INTERNAL_TOKEN":
      draft.internalToken = action.payload;
      return;
    case "SET_STEP":
      draft.step = action.payload;
      return;
    case "TOGGLE_DEBUG":
      draft.debug = !draft.debug;
      return;
    default:
      return;
  }
};

interface Props {
  children: ReactNode;
}

const initialState: State = {
  debug: false,
  externalToken: "",
  internalToken: "",
  maxStep: 5,
  step: 1,
  loading: true,
  jenisID: 1,
  modeTransaksi: "1",
  inquiryRequest: InquiryRequest.parse({ nomorVA: "", nomorIdentitas: "" }),
  inquiryResponse: {
    nomorVA: "",
    stan: "",
    nominalTotal: "",
    nomorIdentitas: "",
    jumlahData: "",
    additionalData: [],
    message: "",
    namaVA: "",
    status: "",
    rrn: "",
  },
  paymentVARequest: PaymentVARequest.parse({ nomorVA: "", nominalVA: "" }),
  paymentVAResponse: {
    message: "",
    status: "",
  },
  fundTransferRequest: {
    transDateTime: Date.now().toString(),
    fromAccount: "",
    nominal: "",
    nomorVA: "",
    keterangan: "pembayaran",
    stan: "010595",
    rrn: "010480000001",
  },
  fundTransferResponse: {
    message: "",
    status: "",
  },
};

export const AppContextProvider = (props: Props) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const dispatcher: Dispatcher = {
    setJenisID: (jenisID: number) =>
      dispatch({ type: "JENIS_ID", payload: jenisID }),
    setNoIdentitas: (noIdentitas: string) =>
      dispatch({ type: "NO_IDENTITAS", payload: noIdentitas }),
    setNoVA: (noVA: string) => dispatch({ type: "NO_VA", payload: noVA }),
    setKodeBank: (kodeBank: string) =>
      dispatch({ type: "KODE_BANK", payload: kodeBank }),
    setKodeInstansi: (kodeInstansi: string) =>
      dispatch({ type: "KODE_INSTANSI", payload: kodeInstansi }),
    setKodeKantorTx: (kodeKantorTx: string) =>
      dispatch({ type: "KODE_KANTOR_TX", payload: kodeKantorTx }),
    setKodeProduk: (kodeProduk: string) =>
      dispatch({ type: "KODE_PRODUK", payload: kodeProduk }),
    setRrn: (rrn: string) => dispatch({ type: "RRN", payload: rrn }),
    setStan: (stan: string) => dispatch({ type: "STAN", payload: stan }),
    setLoading: (loading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setExternalToken: (token: string) =>
      dispatch({ type: "SET_EXTERNAL_TOKEN", payload: token }),
    setInternalToken: (token: string) =>
      dispatch({ type: "SET_INTERNAL_TOKEN", payload: token }),
    setInquiryResponse: (inquiryResponse: InquiryResponse) =>
      dispatch({ type: "SET_INQUIRY_RESPONSE", payload: inquiryResponse }),
    setPaymentVARequest: (paymentVARequest: PaymentVARequest) =>
      dispatch({ type: "SET_PAYMENTVA_REQUEST", payload: paymentVARequest }),
    setPaymentVAResponse: (paymentVAResponse: ResponseStatus) =>
      dispatch({ type: "SET_PAYMENTVA_RESPONSE", payload: paymentVAResponse }),
    setModeTransaksi: (modeTransaksi: string) =>
      dispatch({ type: "SET_MODE_TRANSAKSI", payload: modeTransaksi }),
    setFundTransferRequest: (fundTransferRequest: FundTransferRequest) =>
      dispatch({
        type: "SET_FUNDTRANSFER_REQUEST",
        payload: fundTransferRequest,
      }),
    setFundTransferResponse: (fundTransferResponse: ResponseStatus) =>
      dispatch({
        type: "SET_FUNDTRANSFER_RESPONSE",
        payload: fundTransferResponse,
      }),
    next: () => dispatch({ type: "NEXT", payload: null }),
    back: () => dispatch({ type: "BACK", payload: null }),
    setStep: (step: number) => dispatch({ type: "SET_STEP", payload: step }),
    reset: () => dispatch({ type: "RESET", payload: null }),
    toggleDebug: () => dispatch({ type: "TOGGLE_DEBUG", payload: null }),
  };

  return (
    <AppContextDispatch.Provider value={dispatcher}>
      <AppContextState.Provider value={state}>
        {props.children}
      </AppContextState.Provider>
    </AppContextDispatch.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContextState);
  if (!context) {
    throw new Error("useAppState must be used within a AppContextProvider");
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppContextDispatch);
  if (!context) {
    throw new Error("useAppDispatch must be used within a AppContextProvider");
  }
  return context;
};
