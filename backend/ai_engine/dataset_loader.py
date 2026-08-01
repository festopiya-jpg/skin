import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

class HAM10000Dataset(Dataset):
    def __init__(self, csv_file, root_dirs, transform=None):
        """
        Args:
            csv_file (string): Path to the csv file with annotations.
            root_dirs (list of strings): Directory with all the images (part 1 and part 2).
            transform (callable, optional): Optional transform to be applied on a sample.
        """
        self.metadata = pd.read_csv(csv_file)
        self.root_dirs = root_dirs
        
        # Determine unique classes for mapping
        self.classes = sorted(self.metadata['dx'].unique())
        self.class_to_idx = {cls_name: idx for idx, cls_name in enumerate(self.classes)}
        
        # Use default transforms for ResNet if none are provided
        if transform is None:
            self.transform = transforms.Compose([
                transforms.Resize(224),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                     std=[0.229, 0.224, 0.225])
            ])
        else:
            self.transform = transform

    def __len__(self):
        return len(self.metadata)
    
    def _find_image_path(self, image_id):
        img_name = f"{image_id}.jpg"
        for root_dir in self.root_dirs:
            img_path = os.path.join(root_dir, img_name)
            if os.path.exists(img_path):
                return img_path
        
        # If not found in any directory
        raise FileNotFoundError(f"Image {img_name} not found in provided directories: {self.root_dirs}")

    def __getitem__(self, idx):
        if idx >= len(self):
            raise IndexError("Index out of bounds")
            
        row = self.metadata.iloc[idx]
        image_id = row['image_id']
        label_str = row['dx']
        label = self.class_to_idx[label_str]
        
        img_path = self._find_image_path(image_id)
        
        # Load image
        image = Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

def get_dataloader(csv_file="D:\\archive\\HAM10000_metadata.csv", 
                   root_dirs=["D:\\archive\\HAM10000_images_part_1", "D:\\archive\\HAM10000_images_part_2"],
                   batch_size=32, shuffle=True, num_workers=0):
    """
    Helper function to get the DataLoader.
    """
    dataset = HAM10000Dataset(csv_file=csv_file, root_dirs=root_dirs)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle, num_workers=num_workers)
    return dataloader, dataset.classes
