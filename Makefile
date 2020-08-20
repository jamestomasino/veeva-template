SHELL := /bin/bash

PURPLE = $$(tput setaf 93)
YELLOW = $$(tput setaf 226)
GREEN = $$(tput setaf 46)
RED = $$(tput setaf 196)
RESET = $$(tput sgr0)

ASSETS = $$(find ./presentation -mindepth 1 -maxdepth 1 -type d -not -path 'node_modules')
PROJECT = $$(find ./shared -mindepth 1 -maxdepth 1 -type d -not -path 'node_modules')
HTML = $$(find presentation/ -name "*.html")
JS = $$(find . -name "*.js")

VEEVAFTP := ""
VEEVAUSER := ""
VEEVAPASS := ""

SHARED_RESOURCES_SUPPORT=true

build:
	@printf  "$(GREEN)--- build -----------------------------------------------\n$(RESET)"
	@for x in $(ASSETS); do \
		t=$$(basename $$x); \
		echo "$(GREEN)$$t$(RESET)"; \
		cd "presentation"; \
		if [[ -x "$$t/build" ]]; then \
			cd $$t; \
			build; \
			cd ..; \
		fi; \
		if [[ -f "$$t/gulpfile.js" ]]; then \
			cd $$t; \
			yarn run gulp; \
			cd ..; \
		fi; \
		cd ..; \
	done
	@for x in $(PROJECT); do \
		t=$$(basename $$x); \
		echo "$(GREEN)$$t$(RESET)"; \
		cd "shared";  \
		if [[ -x "$$t/build" ]]; then \
			cd $$t; \
			build; \
			cd ..; \
		fi; \
		if [[ -f "$$t/gulpfile.js" ]]; then \
			cd $$t; \
			yarn run gulp; \
			cd ..; \
		fi; \
		cd ..; \
	done

serve:
	sleep 1 && open "http://localhost:8000/";
	cd "presentation" && python -m SimpleHTTPServer;

zip: build
	@printf  "$(GREEN)--- zip  --------------------------------------------\n$(RESET)"
	@if [[ ! -d "zip" ]]; then \
		mkdir zip; \
	fi
	@for x in $(ASSETS); do \
		t=$$(basename $$x); \
		echo "$(GREEN)$$t$(RESET)"; \
		cd "presentation"; \
		if [ "$(SHARED_RESOURCES_SUPPORT)" = true ] ; then \
			if [[ -f "$$t/exclude.lst" ]]; then \
				zip -9 -r -FS -x=\*shared\* -x=\*.DS_Store\* -x=\*package.json\* -x=\*src\* -x=\*node_modules\* -x=\*.git\* -x=\*exclude.lst\* -x@"$$t/exclude.lst" "../zip/$$t.zip" "$$t"; \
			else \
				zip -9 -r -FS -x=\*shared\* -x=\*.DS_Store\* -x=\*package.json\* -x=\*src\* -x=\*node_modules\* -x=\*.git\* "../zip/$$t.zip" "$$t"; \
			fi; \
		else \
			if [[ -f "$$t/exclude.lst" ]]; then \
				zip -9 -r -FS -x=\*.DS_Store\* -x=\*.git\* -x=\*package.json\* -x=\*src\* -x=\*node_modules\* -x=\*exclude.lst\* -x@"$$t/exclude.lst" "../zip/$$t.zip" "$$t"; \
			else \
				zip -9 -r -FS -x=\*.DS_Store\* -x=\*.git\* -x=\*package.json\* -x=\*src\* -x=\*node_modules\* "../zip/$$t.zip" "$$t"; \
			fi; \
		fi; \
		cd ..; \
	done
	@for x in $(PROJECT); do \
		t=$$(basename $$x); \
		echo "$(GREEN)$$t$(RESET)"; \
		cd "shared";  \
		if [ "$(SHARED_RESOURCES_SUPPORT)" = true ] ; then \
			if [[ -f "$$t/exclude.lst" ]]; then \
				zip -9 -r -FS -x=\*shared\* -x=\*.DS_Store\* -x=\*package.json\* -x=\*src\* -x=\*node_modules\* -x=\*.git\* -x=\*exclude.lst\* -x@"$$t/exclude.lst" "../zip/$$t.zip" "$$t"; \
			else \
				zip -9 -r -FS -x=\*shared\* -x=\*.DS_Store\* -x=\*package.json\* -x=\*src\* -x=\*node_modules\* -x=\*.git\* "../zip/$$t.zip" "$$t"; \
			fi; \
		else \
			echo "Skipping project folders."; \
		fi; \
		cd ..; \
	done

install: update
	@printf "$(PURPLE)--- install ---------------------------------------------\n$(RESET)"
	@if [[ -d "shared/project" ]]; then \
		read -p "$(YELLOW)Project Name [sample-project]:$(RESET) " projectname; \
		projectname=$${projectname:-sample-project}; \
		mv "shared/project/project-thumb.jpg" "shared/project/$$projectname-thumb.jpg";
		mv "shared/project/project.html" "shared/project/$$projectname.html";
		mv "shared/project" "shared/$$projectname"; \
		for x in $(HTML); do \
			sed -i.bak "s/shared\/project/shared\/$$projectname/g" "$$x"; rm "$${x}.bak"; \
		done; \
		for x in $(JS); do \
			sed -i.bak "s/com\.project/com\.$${projectname//-}/g" "$$x"; rm "$${x}.bak"; \
		done; \
	fi;
	@for x in $(PROJECT); do \
		t=$$(basename $$x); \
		cd "shared/$$t"; \
		if [[ ! -d "framework" ]]; then \
			git submodule add https://github.com/jamestomasino/veeva-framework.git framework; \
		fi; \
		cd ../..; \
	done;
	@for x in $(ASSETS); do \
		if [[ ! -L "$$x/shared" ]]; then \
			ln -s ../../shared/ "$$x/shared"; \
		fi; \
	done;
	@for x in $(ASSETS); do \
		t=$$(basename $$x); \
		echo "$(GREEN)$$t$(RESET)"; \
		cd "presentation"; \
		if [[ -f "$$t/gulpfile.js" ]]; then \
			cd $$t; \
			yarn; \
			cd ..; \
		fi; \
		cd ..; \
	done
	@for x in $(PROJECT); do \
		t=$$(basename $$x); \
		echo "$(GREEN)$$t$(RESET)"; \
		cd "shared";  \
		if [[ -f "$$t/gulpfile.js" ]]; then \
			cd $$t; \
			yarn; \
			cd ..; \
		fi; \
		cd ..; \
	done

update:
	git submodule init
	git submodule update --remote

clean:
	@printf    "$(RED)--- clean -----------------------------------------------\n$(RESET)"
	for x in $(ASSETS); do \
		if [[ -L "$$x/shared" ]]; then \
			unlink "$$x/shared"; \
		fi \
	done
	-find . -type d -name 'dist' -exec rm -rf {} \;
	-find . -type d -name 'node_modules' -exec rm -rf {} \;
	rm -rf zip
	rm -rf *.zip

ctl:
	@if [[ ! -d "ctl" ]]; then \
		mkdir ctl; \
	else \
		rm ctl/* ; \
	fi
	@for x in $(ASSETS); do \
		t=$$(basename $$x); \
		ctlFile="ctl/$${t}.ctl"; \
		printf "USER=%s\\n" "$(VEEVAUSER)" > "$$ctlFile"; \
		printf "PASSWORD=%s\\n"  "$(VEEVAPASS)" >> "$$ctlFile"; \
		printf "FILENAME=%s\\n" "$${t}.zip" >> "$$ctlFile"; \
		printf "CLM_ID_vod__c=%s\\n" "$${t}" >> "$$ctlFile"; \
		printf "Name=%s\\n" "$${t}" >> "$$ctlFile"; \
		printf "Slide_Version_vod__c==v1.0" >> "$$ctlFile"; \
	done
	@for x in $(PROJECT); do \
		t=$$(basename $$x); \
		ctlFile="ctl/$${t}.ctl"; \
		printf "USER=%s\\n" "$(VEEVAUSER)" > "$$ctlFile"; \
		printf "PASSWORD=%s\\n"  "$(VEEVAPASS)" >> "$$ctlFile"; \
		printf "FILENAME=%s\\n" "$${t}.zip" >> "$$ctlFile"; \
		printf "CLM_ID_vod__c=%s\\n" "$${t}" >> "$$ctlFile"; \
		printf "Name=%s\\n" "$${t}" >> "$$ctlFile"; \
		printf "Slide_Version_vod__c==v1.0" >> "$$ctlFile"; \
	done

ftp: zip ctl
	@printf   "$(GREEN)--- ftp ------------------------------------------------\n$(RESET)"
	@for x in zip/*; do \
		printf "Uploading: %s\\n" "$$x"; \
		curl --progress -u $(VEEVAUSER):$(VEEVAPASS) -T "$$x" $(VEEVAFTP); \
	done
	@for c in ctl/*; do \
		printf "Uploading: %s\\n" "$$c"; \
		curl --progress -u $(VEEVAUSER):$(VEEVAPASS) -T "$$c" $(VEEVAFTP)/ctlfile/; \
	done

.PHONY: install build zip update clean serve ftp ctl
