; Custom NSIS installer script for Android Kernel Customizer

; Installer sections
Section "WSL2 Check" SEC01
  ; Check if WSL2 is installed
  nsExec::ExecToStack 'wsl --status'
  Pop $0
  Pop $1
  
  ${If} $0 != 0
    MessageBox MB_YESNO|MB_ICONQUESTION "WSL2 is not installed or not properly configured.$\r$\n$\r$\nAndroid Kernel Customizer requires WSL2 for kernel compilation.$\r$\n$\r$\nWould you like to open the WSL2 installation guide?" IDNO skip_wsl_install
    ExecShell "open" "https://docs.microsoft.com/en-us/windows/wsl/install"
    skip_wsl_install:
  ${EndIf}
SectionEnd

Section "Create Desktop Shortcuts" SEC02
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\Android Kernel Customizer.lnk" "$INSTDIR\Android Kernel Customizer.exe" "" "$INSTDIR\resources\icon.ico"
SectionEnd

Section "System Requirements Check" SEC03
  ; Check RAM (minimum 8GB, recommended 16GB)
  System::Call "kernel32::GlobalMemoryStatusEx(i r0) i.r1"
  System::Int64Op $2 / 1073741824  ; Convert to GB
  Pop $3
  
  ${If} $3 < 8
    MessageBox MB_OK|MB_ICONEXCLAMATION "Warning: Your system has less than 8GB of RAM.$\r$\n$\r$\nAndroid kernel compilation may be slow or fail with insufficient memory.$\r$\n$\r$\nRecommended: 16GB+ RAM for optimal performance."
  ${EndIf}
SectionEnd