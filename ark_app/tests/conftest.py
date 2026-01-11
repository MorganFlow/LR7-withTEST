import sys
import os
from pathlib import Path

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
sys.path.append(str(ROOT_DIR))
os.environ['DJANGO_SETTINGS_MODULE'] = 'ark_project.settings'