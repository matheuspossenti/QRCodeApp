import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  Button,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Share } from "react-native";

export default function Historico() {
  const { qrList } = useLocalSearchParams();

  const [qrListArray, setQrListArray] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (qrList) {
      setQrListArray(JSON.parse(qrList));
    } else {
      setQrListArray([]);
    }
  }, [qrList]); // Executa quando qrList mudar

  const limparHistorico = () => {
    Alert.alert("Confirmar", "Deseja limpar todo o histórico?", [
      { text: "Cancelar" },
      { text: "Limpar", onPress: () => setQrListArray([]) },
    ]);
  };

  const renderItem = async ({ item }) => {
    const { url, timestamp } = item;

    const validURL = await Linking.canOpenURL(url);

    if (validURL) {
      return (
        <View style={styles.listItem}>
          <Ionicons
            name="qr-code-outline"
            size={24}
            style={[styles.icon, darkMode && styles.textDark]}
          />
          <Text
            style={[
              styles.listText,
              darkMode && styles.textDark,
              url.startsWith("http") && styles.link,
            ]}
            onPress={() => {
              if (url.startsWith("http")) {
                Linking.openURL(url);
              }
            }}
            onLongPress={() => Share.share({ message: url })}
          >
            {url}
          </Text>
          <Text style={[styles.timestamp, darkMode && styles.textDark]}>
            <Ionicons name="time-outline" size={16} />
            {` ${timestamp}`}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.listItem}>
        <Text style={styles.listText}>{`${index + 1}. ${item}`}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.historyContainer, darkMode && styles.containerDark]}>
      <Text style={[styles.historyTitle, darkMode && styles.textDark]}>
        <Ionicons name="list-outline" size={24} /> Histórico de QR Codes
      </Text>
      <FlatList
        data={qrListArray}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={
          <Text style={[styles.emptyText, darkMode && styles.textDark]}>
            <Ionicons name="alert-circle-outline" size={24} /> Nenhum QR Code
            escaneado ainda
          </Text>
        }
      />
      <View style={styles.buttonContainer}>
        <Button title="Limpar Histórico" onPress={limparHistorico} />
        <Button
          title={darkMode ? "Tema Claro" : "Tema Escuro"}
          onPress={() => setDarkMode(!darkMode)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  listText: {
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  textDark: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 20,
  },
});
