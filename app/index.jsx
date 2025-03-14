import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState("");
  const [qrList, setQrList] = useState([]);

  // Handle loading state for permissions
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos de permissão para acessar a câmera
        </Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(facing === "back" ? "front" : "back");
  }

  const handleCamera = ({ data }) => {
    setScanned(true);
    setQrData(data);
    setQrList([
      ...qrList,
      { url: data, timestamp: new Date().toLocaleString() },
    ]);
    Alert.alert("QR Code escaneado", `Conteúdo: ${data}`, [
      { text: "OK", onPress: () => console.log("Opa, tudo bom guri?") },
    ]);
  };

  const irParaHistorico = () => {
    router.push({
      pathname: "/historico",
      params: { qrList: JSON.stringify(qrList) },
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleCamera}
      />

      <View style={styles.reverseCameraButtonContainer}>
        <TouchableOpacity
          style={styles.buttonCamera}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.overlay}>
        <View style={styles.controlsContainer}>
          {scanned && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.buttonText}>Escanear Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={irParaHistorico}>
                <Text style={styles.buttonText}>Ver Histórico</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {qrData !== "" && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText} numberOfLines={2}>
              Último QR: {qrData}
            </Text>
          </View>
        )}

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Total de QR Codes: {qrList.length}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  reverseCameraButtonContainer: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  camera: {
    flex: 1,
  },
  buttonCamera: {
    fontSize: 24,
    color: "white",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  resultContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  counterContainer: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    fontWeight: "600",
  },
  message: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    padding: 20,
  },
});
