import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models
from dataset_loader import get_dataloader

def train():
    # 1. Setup Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}", flush=True)

    # 2. Load Data
    print("Loading HAM10000 Dataset...", flush=True)
    try:
        dataloader, classes = get_dataloader(batch_size=4, num_workers=0)
        num_classes = len(classes)
        print(f"Found {num_classes} classes: {classes}")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return

    # 3. Initialize Model
    # Using a pre-trained ResNet50 as a powerful baseline
    print("Initializing ResNet50 Model...", flush=True)
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    
    # Replace the final fully connected layer to match our number of classes
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    
    model = model.to(device)

    # 4. Define Loss Function and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-4)

    # 5. Training Loop Blueprint
    num_epochs = 5
    print("Starting Training Loop...")
    
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for batch_idx, (images, labels) in enumerate(dataloader):
            images, labels = images.to(device), labels.to(device)
            
            # Zero the parameter gradients
            optimizer.zero_grad()
            
            # Forward pass
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            # Backward pass and optimize
            loss.backward()
            optimizer.step()
            
            # Statistics
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            if batch_idx % 10 == 0:
                print(f"Epoch [{epoch+1}/{num_epochs}] Batch {batch_idx}/{len(dataloader)} "
                      f"Loss: {loss.item():.4f} Acc: {100 * correct / total:.2f}%")
        
        epoch_loss = running_loss / len(dataloader)
        epoch_acc = 100 * correct / total
        print(f"--- Epoch {epoch+1} Summary: Loss: {epoch_loss:.4f} Acc: {epoch_acc:.2f}% ---\n")
        
        # Save model checkpoint
        checkpoint_path = f"resnet50_ham10000_epoch_{epoch+1}.pth"
        torch.save(model.state_dict(), checkpoint_path)
        print(f"Saved checkpoint: {checkpoint_path}")

    print("Training Complete!")

if __name__ == "__main__":
    # Ensure this block prevents multiprocessing errors on Windows with DataLoader
    train()
